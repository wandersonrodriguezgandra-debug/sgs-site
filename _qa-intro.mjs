// QA — captura a sequência do preloader por TEMPO (arquivo temporário).
import { chromium } from '@playwright/test'

const OUT = 'C:\\Users\\User\\AppData\\Local\\Temp\\claude\\C--Users-User-Documents-trae-projects-sgs-seguraca\\1f092ef9-5955-4cf8-a536-43119e029470\\scratchpad'
const headed = process.argv[2] === 'headed'
const url = 'http://localhost:5173/?motion=on&graphicsQuality=high&intro=force'

const browser = await chromium.launch({ headless: !headed, args: ['--ignore-gpu-blocklist', '--use-gl=angle'] })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
const page = await context.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message.slice(0, 120)))

// navega e captura em intervalos curtos para pegar a sequência
await page.goto(url, { waitUntil: 'commit', timeout: 30000 })
const times = [250, 550, 900, 1300, 1800, 2400, 3200]
let prev = 0
for (let i = 0; i < times.length; i++) {
  await page.waitForTimeout(times[i] - prev)
  prev = times[i]
  await page.screenshot({ path: `${OUT}\\intro-${String(i).padStart(2, '0')}.png` })
  process.stdout.write(`intro-${String(i).padStart(2, '0')}.png @${times[i]}ms\n`)
}
console.log('ERRORS:', errors.length ? [...new Set(errors)].slice(0, 6) : 'none')
await browser.close()
