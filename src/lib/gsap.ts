import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Só os plugins com uso real no site: ScrollTrigger (scanner, scroll suave)
// e SplitText (Heading). Flip/Observer/MotionPathPlugin/DrawSVGPlugin foram
// registrados sem nenhum consumidor e removidos (~98 KB de código morto).
gsap.registerPlugin(ScrollTrigger, SplitText)

// Curva de easing de assinatura do SGS — usada em reveals e câmeras.
// Aproxima um expo.out com leve overshoot controlado.
if (!gsap.parseEase('sgs')) {
  gsap.registerEase('sgs', (p: number) => 1 - Math.pow(1 - p, 4))
}

export { gsap, ScrollTrigger, SplitText }
