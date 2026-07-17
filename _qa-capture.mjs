// QA screenshot capture (arquivo temporário — remover ao fim da tarefa).
// Browser real (rAF ativo) para ver animações que o preview (document.hidden) não renderiza.
// Rola PROGRESSIVAMENTE (para ScrollTrigger/reveals assentarem) e fotografa em N frames.
// Uso: node _qa-capture.mjs <label> <quality> [numFrames] [headed]
import { chromium } from '@playwright/test'

const OUT = 'C:\\Users\\User\\AppData\\Local\\Temp\\claude\\C--Users-User-Documents-trae-projects-sgs-seguraca\\1f092ef9-5955-4cf8-a536-43119e029470\\scratchpad'
const label = process.argv[2] || 'frame'
const quality = process.argv[3] || 'high'
const frames = parseInt(process.argv[4] || '7', 10)
const headed = process.argv[5] === 'headed'
const url = `http://localhost:5173/?motion=on&graphicsQuality=${quality}`

const browser = await chromium.launch({
  headless: !headed,
  args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-gl=angle'],
})
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
  deviceScaleFactor: 1,
})
const page = await context.newPage()

const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message.slice(0, 120)))

await page.goto(url, { waitUntil: 'load', timeout: 30000 })
await page.waitForTimeout(2500)

const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)

// Rolagem progressiva em passos pequenos para reveals/pin assentarem
let cur = 0
const step = 350
async function scrollToProgressive(targetY) {
  while (cur < targetY) {
    cur = Math.min(cur + step, targetY)
    await page.evaluate((yy) => {
      const l = window.__lenis
      if (l) l.scrollTo(yy, { immediate: true })
      else window.scrollTo(0, yy)
      window.dispatchEvent(new Event('scroll'))
    }, cur)
    await page.waitForTimeout(60)
  }
}

for (let i = 0; i < frames; i++) {
  const y = Math.round((total * i) / (frames - 1))
  await scrollToProgressive(y)
  await page.waitForTimeout(700)
  const file = `${OUT}\\${label}-${String(i).padStart(2, '0')}.png`
  await page.screenshot({ path: file })
  process.stdout.write(`saved ${label}-${String(i).padStart(2, '0')}.png @y=${y}\n`)
}

console.log('ERRORS:', errors.length ? [...new Set(errors)].slice(0, 8) : 'none')
await browser.close()
