// scripts/to-artifact.mjs — turns dist/index.html into dist/artifact.html for publishing on claude.ai
// (claude.ai adds its own <html>/<head>/<body>, so the page content is written without them).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(WEB, "dist/index.html"), "utf8");

const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
const links = html.match(/<link[^>]+fonts\.googleapis[^>]*>/g) || [];
const styles = html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || [];
const scripts = html.match(/<script[^>]*>[\s\S]*?<\/script>/g) || [];

const out = [
  title,
  '<meta name="claude:viewport-fit-sides" content="cover">',
  ...links,
  ...styles,
  '<div id="root"></div>',
  ...scripts,
].join("\n");

fs.writeFileSync(path.join(WEB, "dist/artifact.html"), out);
console.log(`dist/artifact.html: ${(out.length / 1024).toFixed(0)} KB`);
