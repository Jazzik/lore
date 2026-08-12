#!/usr/bin/env node
// Diffs key sets between messages/ru.json and messages/en.json (recursively).
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..", "..");
const ruPath = path.join(root, "messages", "ru.json");
const enPath = path.join(root, "messages", "en.json");

function collectKeys(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...collectKeys(v, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const ru = JSON.parse(fs.readFileSync(ruPath, "utf8"));
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

const ruKeys = new Set(collectKeys(ru));
const enKeys = new Set(collectKeys(en));

const missingInEn = [...ruKeys].filter((k) => !enKeys.has(k)).sort();
const missingInRu = [...enKeys].filter((k) => !ruKeys.has(k)).sort();

if (missingInEn.length === 0 && missingInRu.length === 0) {
  console.log(`OK — ${ruKeys.size} keys, ru.json and en.json are in parity.`);
  process.exit(0);
}

if (missingInEn.length) {
  console.log(`Missing in en.json (${missingInEn.length}):`);
  missingInEn.forEach((k) => console.log(`  - ${k}`));
}
if (missingInRu.length) {
  console.log(`Missing in ru.json (${missingInRu.length}):`);
  missingInRu.forEach((k) => console.log(`  - ${k}`));
}
process.exit(1);
