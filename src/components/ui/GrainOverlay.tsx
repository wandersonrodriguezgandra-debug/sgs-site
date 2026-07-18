/**
 * Textura de ruído sutil fixa sobre toda a página — assinatura de estúdios
 * premiados (Locomotive, Active Theory) que dá profundidade e "peso" ao
 * fundo azul chapado. Puro CSS (ver .sgs-grain-overlay em globals.css),
 * sem custo de animação — decorativo, oculto de leitores de tela.
 */
export default function GrainOverlay() {
  return <div className="sgs-grain-overlay" aria-hidden="true" />
}
