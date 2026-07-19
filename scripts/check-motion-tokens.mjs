#!/usr/bin/env node
// Bloqueia motion local (spring/elastic/back/duração e easing soltos) fora
// das fontes canônicas em src/components/motion/tokens.ts e src/lib/gsap.ts.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const SRC = join(ROOT, 'src')
const EXCLUDED_FILES = new Set([
  join(SRC, 'components', 'motion', 'tokens.ts'),
  join(SRC, 'lib', 'gsap.ts'),
])

const RULES = [
  { name: "Framer Motion spring ({ type: 'spring' })", pattern: /type:\s*['"]spring['"]/g },
  { name: 'Parâmetro de spring solto (stiffness/damping)', pattern: /\b(stiffness|damping)\s*:\s*\d+/g },
  { name: 'Easing GSAP elástico/back/bounce', pattern: /\b(elastic|back|bounce)\.(out|in|inOut)\s*\(/g },
  { name: 'cubic-bezier hardcoded fora dos tokens', pattern: /cubic-bezier\(/g },
]

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stats = statSync(full)
    if (stats.isDirectory()) {
      walk(full, files)
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(full)
    }
  }
  return files
}

const files = walk(SRC).filter((f) => !EXCLUDED_FILES.has(f))
const violations = []

for (const file of files) {
  const content = readFileSync(file, 'utf8')
  const lines = content.split('\n')

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0
    let match
    while ((match = rule.pattern.exec(content))) {
      const upTo = content.slice(0, match.index)
      const line = upTo.split('\n').length
      violations.push({
        file: relative(ROOT, file),
        line,
        rule: rule.name,
        snippet: lines[line - 1]?.trim().slice(0, 100) ?? '',
      })
    }
  }
}

if (violations.length === 0) {
  console.log('check-motion-tokens: nenhuma violação encontrada.')
  process.exit(0)
}

console.log(`check-motion-tokens: ${violations.length} violação(ões) encontrada(s):\n`)
for (const v of violations) {
  console.log(`  ${v.file}:${v.line} — ${v.rule}`)
  console.log(`    ${v.snippet}`)
}

process.exit(1)
