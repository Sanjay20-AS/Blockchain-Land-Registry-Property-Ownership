const fs = require("fs");
const crypto = require("crypto");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/hash-document.js <file>");
  process.exit(1);
}

const buffer = fs.readFileSync(file);
const hash = crypto.createHash("sha256").update(buffer).digest("hex");
console.log(`SHA-256: ${hash}`);
