import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'
import { writeFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

function findPlaywrightChrome() {
  const pwDir = join(homedir(), 'AppData', 'Local', 'ms-playwright')
  if (!existsSync(pwDir)) return null
  const dirs = readdirSync(pwDir).filter(d => d.startsWith('chromium') && !d.includes('headless'))
  if (dirs.length === 0) return null
  for (const sub of ['chrome-win64', 'chrome-win']) {
    const exePath = join(pwDir, dirs[0], sub, 'chrome.exe')
    if (existsSync(exePath)) return exePath
  }
  return null
}

const chromePath = process.env.CHROME_PATH || findPlaywrightChrome()

const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1 },
  },
}

const chrome = await launch({
  chromePath,
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-software-rasterizer', '--allow-insecure-localhost'],
})

const url = process.env.URL || 'http://localhost:4173'
const result = await lighthouse(url, { port: chrome.port }, config)

try { await chrome.kill() } catch {}

const reportJson = JSON.stringify(result.lhr, null, 2)
const reportHtml = result.report

writeFileSync('lighthouse-report.json', reportJson)
writeFileSync('lighthouse-report.html', reportHtml)

const categories = result.lhr.categories
console.log('\n=== Lighthouse Report ===')
for (const [name, cat] of Object.entries(categories)) {
  const score = Math.round((cat.score ?? 0) * 100)
  const icon = score >= 90 ? '\u{1F7E2}' : score >= 50 ? '\u{1F7E0}' : '\u{1F534}'
  console.log(`${icon} ${name}: ${score}`)
}
console.log('=========================\n')
console.log(`Full report: lighthouse-report.html`)
