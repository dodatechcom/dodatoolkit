import { build } from 'electron-builder'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Generate icons from SVG
async function generateIcons() {
  const outDir = resolve(root, 'icons')
  mkdirSync(outDir, { recursive: true })
  const sizes = [16, 32, 48, 64, 128, 256, 512]
  const svg = readFileSync(resolve(root, 'build', 'icon.svg'))

  try {
    const sharp = (await import('sharp')).default
    for (const size of sizes) {
      writeFileSync(resolve(outDir, `${size}x${size}.png`), await sharp(svg).resize(size, size).png().toBuffer())
    }
    writeFileSync(resolve(outDir, 'icon.png'), await sharp(svg).resize(512, 512).png().toBuffer())
    console.log('Icons generated')
  } catch {
    console.log('sharp not installed — skipping icon generation (SVG will be used where supported)')
  }
}

async function main() {
  // Build Vite frontend
  execSync('npm run build', { cwd: root, stdio: 'inherit' })
  // Build Electron main/preload
  execSync('node scripts/build-electron.mjs', { cwd: root, stdio: 'inherit' })
  // Generate icons
  await generateIcons()
  // Package with electron-builder
  await build({ config: { ...require(resolve(root, 'package.json')).build } })
}

main().catch(e => { console.error(e); process.exit(1) })
