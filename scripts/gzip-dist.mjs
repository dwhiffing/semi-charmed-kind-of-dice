// Gzip all files in dist and log gzipped sizes in KB
import fs from "node:fs"
import path from "node:path"
import zlib from "node:zlib"

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const distDir = path.resolve(__dirname, '../dist');

function getAllFiles(dir) {
  return fs.readdirSync(dir).flatMap(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      return getAllFiles(fullPath);
    }
    return [fullPath];
  });
}

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist');
  process.exit(1);
}

const files = getAllFiles(distDir);
let totalGzipped = 0;


files.forEach(file => {
  const content = fs.readFileSync(file);
  const gzipped = zlib.gzipSync(content);
  totalGzipped += gzipped.length;
});

const totalKB = (totalGzipped / 1024).toFixed(2);
const maxKB = 13;
const remainingKB = (maxKB - totalGzipped / 1024).toFixed(2);
const percentUsed = ((totalGzipped / 1024) / maxKB * 100).toFixed(2);

console.log(`Total gzipped size: ${totalKB} KB`);
console.log(`Remaining: ${remainingKB} KB (${percentUsed}%) out of ${maxKB} KB`);
