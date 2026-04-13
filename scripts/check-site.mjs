import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { renderSiteHtml } from "./build-site.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(scriptPath), "..");
const outputPath = path.join(rootDir, "index.html");

const expected = await renderSiteHtml();
const actual = await readFile(outputPath, "utf8");

if (actual !== expected) {
  console.error(
    "index.html is out of date. Run `npm run build` and commit the result.",
  );
  process.exit(1);
}

console.log("Generated index.html is up to date.");
