// Configuração de áudio opcional
// Todos os sons são sintetizados via Web Audio API — nenhum arquivo externo necessário

export interface AudioCue {
  id: string
  type: 'sine' | 'sweep' | 'noise' | 'impact' | 'confirm'
  frequency?: [number, number] // [start, end] para sweep
  duration: number
  volume: number
  cooldown: number // ms sem repetir
}

export const audioCues: AudioCue[] = [
  {
    id: 'voxel-formation',
    type: 'sweep',
    frequency: [200, 600],
    duration: 2.0,
    volume: 0.15,
    cooldown: 3000,
  },
  {
    id: 'voxel-complete',
    type: 'confirm',
    duration: 0.4,
    volume: 0.12,
    cooldown: 2000,
  },
  {
    id: 'scan-sweep',
    type: 'sweep',
    frequency: [400, 1200],
    duration: 0.8,
    volume: 0.08,
    cooldown: 1500,
  },
  {
    id: 'shield-activate',
    type: 'impact',
    duration: 0.3,
    volume: 0.1,
    cooldown: 2000,
  },
  {
    id: 'time-freeze',
    type: 'sweep',
    frequency: [600, 80],
    duration: 0.6,
    volume: 0.1,
    cooldown: 5000,
  },
  {
    id: 'time-resume',
    type: 'sweep',
    frequency: [80, 500],
    duration: 0.5,
    volume: 0.08,
    cooldown: 5000,
  },
  {
    id: 'through-screen',
    type: 'noise',
    duration: 0.8,
    volume: 0.06,
    cooldown: 3000,
  },
  {
    id: 'chain-step',
    type: 'sine',
    frequency: [440, 880],
    duration: 0.15,
    volume: 0.06,
    cooldown: 200,
  },
  {
    id: 'success',
    type: 'confirm',
    duration: 0.5,
    volume: 0.12,
    cooldown: 2000,
  },
]
