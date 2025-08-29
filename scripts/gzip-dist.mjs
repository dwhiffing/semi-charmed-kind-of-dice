// Gzip all files in dist and log gzipped sizes per file and total
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const distDir = path.resolve(__dirname, '../dist')

function getAllFiles(dir) {
  return fs.readdirSync(dir).flatMap((file) => {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      return getAllFiles(fullPath)
    }
    return [fullPath]
  })
}

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist')
  process.exit(1)
}

const files = getAllFiles(distDir).filter((f) => fs.statSync(f).isFile())
let totalGzipped = 0
const maxKB = 13

const fileInfos = files.map((file) => {
  const content = fs.readFileSync(file)
  const gzipped = zlib.gzipSync(content)
  const size = gzipped.length // bytes
  totalGzipped += size
  return { file, size }
})

// sort by size descending
fileInfos.sort((a, b) => b.size - a.size)

if (fileInfos.length === 0) {
  console.log('No files found in dist.')
  process.exit(0)
}

// compute formatting widths
const relPaths = fileInfos.map((fi) => path.relative(distDir, fi.file))
const maxPathLen = Math.max(...relPaths.map((p) => p.length), 10)

console.log('Gzipped sizes per file:')
fileInfos.forEach(({ file, size }) => {
  const rel = path.relative(distDir, file)
  const kb = size / 1024
  const kbStr = kb.toFixed(2).padStart(7)
  const pctOfBudget = ((kb / maxKB) * 100).toFixed(2).padStart(6)
  console.log(
    `${rel.padEnd(maxPathLen)}  ${kbStr} KB   ${pctOfBudget}% of ${maxKB}KB`,
  )
})

const totalKB = totalGzipped / 1024
const totalKBStr = totalKB.toFixed(2)
const remainingKB = (maxKB - totalKB).toFixed(2)
const percentUsed = ((totalKB / maxKB) * 100).toFixed(2)

const barLength = 20
const filledLength = Math.min(
  barLength,
  Math.round((barLength * percentUsed) / 100),
)
const bar = '█'.repeat(filledLength) + '-'.repeat(barLength - filledLength)

console.log('')
console.log(
  `[${bar}] ${totalKBStr} KB of ${maxKB} KB used (${percentUsed}%) — ${remainingKB} KB remaining`,
)
