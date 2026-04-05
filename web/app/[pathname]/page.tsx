import { notFound, redirect } from "next/navigation";

interface Props {
    params: Promise<{ pathname: string; }>;
}

const fetchOptions = { next: { revalidate: 60 * 60 } };
const utm = "?utm_source=notificationbot.up.railway.app&utm_medium=redirect";

export default async function Home({ params }: Props) {
    const { pathname } = await params;

    switch (pathname) {
        case "support":
            return redirect("https://discord.gg/fUsRWyPNha");
        case "vote":
            return redirect("https://top.gg/bot/1366507117044957276#vote" + utm);
        case "add":
            return redirect("https://discord.com/oauth2/authorize?client_id=1366507117044957276");
        case "docs":
        case "guides":
            return redirect("/docs/home");
        case "invite":
            return redirect("https://discord.com/oauth2/authorize?client_id=1366507117044957276");
        case "youtube": {
            const res = (await fetch("https://discord.gg/GNdJMJCBdu", fetchOptions)
                .then((res) => res.json())
                .catch(() => null)) as { videoUrl: string; } | null;

            return redirect(res?.videoUrl || "https://discord.gg/GNdJMJCBdu");
        }
    }

    notFound();
}