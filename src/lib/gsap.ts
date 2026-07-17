import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

// GSAP 3.13+ liberou todos os antigos plugins "Club" gratuitamente.
// Registramos o conjunto usado pela camada de motion do site.
gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  Flip,
  Observer,
  MotionPathPlugin,
  DrawSVGPlugin,
)

// Curva de easing de assinatura do SGS — usada em reveals e câmeras.
// Aproxima um expo.out com leve overshoot controlado.
if (!gsap.parseEase('sgs')) {
  gsap.registerEase('sgs', (p: number) => 1 - Math.pow(1 - p, 4))
}

export {
  gsap,
  ScrollTrigger,
  SplitText,
  Flip,
  Observer,
  MotionPathPlugin,
  DrawSVGPlugin,
}
