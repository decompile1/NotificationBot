import { Hono } from "hono";
import sharp from "sharp";

const router = new Hono();

router.get("/", async (c) => {
    const type = c.req.query("type");
    const username = c.req.query("username") || "Unknown User";
    const members = c.req.query("members") || "0";
    const avatarHash = c.req.query("hash") || ""; // Discord avatar hash
    const userId = c.req.query("id") || "";
    const background = c.req.query("background") || "#222";
    const textColor = c.req.query("text_color") || "#fff";

    if (type !== "welcome" && type !== "goodbye") {
        return c.text('Invalid type — must be "welcome" or "goodbye"', 400);
    }

    const title = type === "welcome" ? `Welcome, ${username}!` : `Goodbye, ${username}!`;

    let baseImage: Buffer;

    if (background.startsWith("http")) {
        try {
            const response = await fetch(background);
            if (!response.ok) return c.text("Failed to fetch background image", 400);
            const arrayBuffer = await response.arrayBuffer();
            baseImage = Buffer.from(arrayBuffer);
        } catch (err) {
            return c.text("Error fetching background image", 500);
        }
    } else {
        baseImage = await sharp({
            create: {
                width: 1024,
                height: 450,
                channels: 3,
                background: background,
            },
        })
            .png()
            .toBuffer();
    }

    // Fetch Discord avatar image if hash exists

let avatarBuffer: Buffer | null = null;
const AVATAR_SIZE = 128; // width & height of avatar
const CARD_HEIGHT = 450;

if (userId && avatarHash) {
    try {
        const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.webp?size=128`;
        const response = await fetch(avatarUrl);
        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            avatarBuffer = await sharp(Buffer.from(arrayBuffer))
                .resize(AVATAR_SIZE, AVATAR_SIZE)
                .composite([
                    {
                        input: Buffer.from(
                            `<svg width="${AVATAR_SIZE}" height="${AVATAR_SIZE}"><circle cx="${AVATAR_SIZE/2}" cy="${AVATAR_SIZE/2}" r="${AVATAR_SIZE/2}" fill="white"/></svg>`
                        ),
                        blend: "dest-in"
                    }
                ])
                .png()
                .toBuffer();
        }
    } catch (err) {
        console.warn("Failed to fetch Discord avatar:", err);
    }
}

    // Create SVG overlay with text, leaving space for avatar
    const svgOverlay = `
<svg width="1024" height="450">
  <text x="170" y="120" font-size="50" fill="${textColor}" font-family="Sans">${title}</text>
  <text x="170" y="200" font-size="38" fill="${textColor}" font-family="Sans">Members: ${members}</text>
</svg>
`;

    let finalImage = sharp(baseImage).resize(1024, 450);

    // Composite the avatar on the left if available
if (avatarBuffer) {
    finalImage = finalImage.composite([
        {
            input: avatarBuffer,
            top: Math.floor((CARD_HEIGHT - AVATAR_SIZE) / 2), // center vertically
            left: 50 // padding from left
        },
        { input: Buffer.from(svgOverlay), top: 0, left: 0 }
    ]);
} else {
    finalImage = finalImage.composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }]);
}

    const finalBuffer = await finalImage.png().toBuffer();

    return c.body(new Uint8Array(finalBuffer), {
        status: 200,
        headers: { "Content-Type": "image/png" },
    });
});

export default router;