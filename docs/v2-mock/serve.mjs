// Static server for this mock: `node docs/v2-mock/serve.mjs`, then open http://127.0.0.1:4173
// The files also open straight from disk; this only exists for previews that cannot read file:// URLs.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = import.meta.dirname;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };

createServer(async (request, response) => {
  const requested = normalize(decodeURIComponent(new URL(request.url, "http://x").pathname)).replace(/^[\\/]+/, "");
  const file = requested || "index.html";
  try {
    const body = await readFile(join(root, file));
    response.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
    response.end(body);
  } catch {
    response.writeHead(404).end("not found");
  }
}).listen(4173, "127.0.0.1");
