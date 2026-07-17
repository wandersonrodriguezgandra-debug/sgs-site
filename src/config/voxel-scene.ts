// Configuração centralizada da materialização por voxels
// DADO DEMONSTRATIVO — substituir por geometria oficial do SGS

export const voxelConfig = {
  // Quantidade por qualidade
  counts: {
    ultra: 3000,
    high: 1500,
    medium: 500,
    low: 0,
  } as Record<string, number>,

  // Forma do escudo — domo com borda
  shieldShape: {
    radius: 0.4,
    height: 0.5,
    thickness: 0.08,
    segments: 24,
    rings: 12,
  },

  // Animação
  animation: {
    duration: 3, // segundos para formação completa
    noiseStrength: 0.6,
    assemblyRadius: 1.5,
    pulseFrequency: 1.2,
    staggerSpread: 0.4,
  },

  // Cores
  colors: {
    start: '#3b82f6', // azul institucional
    end: '#06b6d4',   // ciano SGS
    pulse: '#22c55e', // verde confirmação
  },
}
