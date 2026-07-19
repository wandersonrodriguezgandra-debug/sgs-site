export const motionTokens = {
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.45,
    slow: 0.8,
    cinematic: 1.2,
    dramatic: 1.8,
  },
  stagger: {
    micro: 0.02,
    fast: 0.04,
    normal: 0.08,
    slow: 0.14,
    dramatic: 0.22,
  },
  ease: {
    smooth: [0.4, 0, 0.2, 1] as const,
    cinematic: [0.65, 0, 0.35, 1] as const,
    sgs: [0.16, 1, 0.3, 1] as const,
    power3Out: [0.33, 1, 0.68, 1] as const,
    expoOut: [0.19, 1, 0.22, 1] as const,
  },
  gsapEase: {
    sgs: 'sgs',
    expo: 'expo.out',
    power4: 'power4.out',
    power3: 'power3.out',
    power2: 'power2.out',
    smooth: 'power2.inOut',
  },
  reveal: {
    charStagger: 0.018,
    wordStagger: 0.05,
    lineStagger: 0.09,
    duration: 0.9,
    yFrom: 40,
    blurFrom: 12,
    startTrigger: 'top 80%',
  },
  distance: {
    tiny: 5,
    short: 10,
    medium: 20,
    long: 30,
    dramatic: 60,
  },
  blur: {
    subtle: 2,
    light: 4,
    medium: 8,
    strong: 16,
    dramatic: 24,
  },
  parallax: {
    subtle: 10,
    normal: 16,
    // Teto aprovado na Fase 3: nenhum parallax excede 16px, mesmo em
    // seções que antes pediam mais (Dashboard/Security).
    max: 16,
  },
  tilt: {
    subtle: 3,
    medium: 8,
    high: 15,
  },
  perspective: {
    default: 1000,
    wide: 2000,
  },
  depth: {
    flat: 0,
    shallow: 12,
    deep: 30,
  },
  scale: {
    press: 0.97,
    hover: 1.03,
  },
  spotlight: {
    size: 400,
    subtleOpacity: 0.1,
    mediumOpacity: 0.18,
  },
  scanner: {
    scrub: 0.65,
  },
}

/** CSS easing string for a Web Animations API `easing` option, built from an `ease.*` token. */
export function cssEase(token: readonly [number, number, number, number]): string {
  return `cubic-bezier(${token[0]},${token[1]},${token[2]},${token[3]})`
}
