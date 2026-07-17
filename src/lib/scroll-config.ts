// DADO DEMONSTRATIVO — substituir por valores reais de produção

export const scrollConfig = {
  scrub: {
    default: 1,
    slow: 2,
    fast: 0.5,
  },
  pinSpacing: true,
  markers: false,
  start: 'top top',
  end: 'bottom bottom',
  horizontal: {
    width: '500vw',
    panelWidth: 100 / 6 + '%',
  },
  counters: {
    duration: 1.5,
    ease: 'power2.out',
  },
  charts: {
    duration: 1,
    ease: 'power1.out',
  },
  svg: {
    duration: 2,
    ease: 'power2.inOut',
  },
  transitions: {
    duration: 0.6,
    stagger: 0.12,
  },
} as const
