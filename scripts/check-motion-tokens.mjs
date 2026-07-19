#!/usr/bin/env node
// Bloqueia motion local (spring/elastic/back/duração e easing soltos) fora
// das fontes canônicas em src/components/motion/tokens.ts e src/lib/gsap.ts.
//
// LEGACY_ALLOWLIST era o débito conhecido da migração ao Motion System
// (Fase 4, etapa 2) — zerada. Mantida como Set vazio de propósito: qualquer
// entrada futura é débito novo, não histórico, e deve vir com justificativa.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const SRC = join(ROOT, 'src')
const EXCLUDED_FILES = new Set([
  join(SRC, 'components', 'motion', 'tokens.ts'),
  join(SRC, 'lib', 'gsap.ts'),
])

const LEGACY_ALLOWLIST = new Set(
  /** @type {string[]} */ ([]).map((p) => p.split('/').join(sep)),
)

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
const blocking = []
const legacy = []

for (const file of files) {
  const relPath = relative(ROOT, file)
  const content = readFileSync(file, 'utf8')
  const lines = content.split('\n')
  const bucket = LEGACY_ALLOWLIST.has(relPath) ? legacy : blocking

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0
    let match
    while ((match = rule.pattern.exec(content))) {
      const upTo = content.slice(0, match.index)
      const line = upTo.split('\n').length
      bucket.push({
        file: relPath,
        line,
        rule: rule.name,
        snippet: lines[line - 1]?.trim().slice(0, 100) ?? '',
      })
    }
  }
}

if (legacy.length > 0) {
  console.log(`check-motion-tokens: ${legacy.length} violação(ões) em débito conhecido (allowlist, não bloqueia):\n`)
  for (const v of legacy) {
    console.log(`  ${v.file}:${v.line} — ${v.rule}`)
  }
  console.log('')
}

if (blocking.length === 0) {
  console.log('check-motion-tokens: nenhuma violação bloqueante fora da allowlist.')
  process.exit(0)
}

console.log(`check-motion-tokens: ${blocking.length} violação(ões) BLOQUEANTE(S) fora da allowlist:\n`)
for (const v of blocking) {
  console.log(`  ${v.file}:${v.line} — ${v.rule}`)
  console.log(`    ${v.snippet}`)
}
console.log('\nArquivos novos não entram na allowlist — migre para os tokens canônicos.')

process.exit(1)
