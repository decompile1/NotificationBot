import { serve } from "@hono/node-server";
import { Hono } from "hono";
import sharp from "sharp";
import { serveStatic } from '@hono/node-server/serve-static'
import { HttpErrorCode, HttpErrorMessage } from "./constants/http-error.js";
import baseRouter from "./routes/base-router";

const app = new Hono();

app.route("/", baseRouter);

app.all("/*", async () => {
    const status = HttpErrorCode.NotFound;
    const message = HttpErrorMessage.NotFound;

    // Build SVG for error display
    const svg = `
  <svg width="800" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#111"/>
    <text x="50%" y="40%" fill="#fff" font-size="48" font-family="Sans" text-anchor="middle">${status}</text>
    <text x="50%" y="60%" fill="#bbb" font-size="28" font-family="Sans" text-anchor="middle">${message}</text>
  </svg>
  `;

    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(new Uint8Array(png), {
        status,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-store"
        }
    });
});

app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/src/static'),
  })
)

const PORT = Number(process.env.PORT) || 5000;

serve(
    {
        fetch: app.fetch,
        port: PORT
    },
    (info) => {
        console.log(`Server listening on http://localhost:${info.port}`);
    }
);

export default app;