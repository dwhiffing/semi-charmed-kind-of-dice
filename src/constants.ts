export const DEV = false

export const initialDelay = DEV ? 100 : 250
export const perDieOffset = DEV ? 100 : 250
export const afterSubmitRollDelay = DEV ? 150 : 300

export const SVGS = [
  `d${20}`,
  `d${12}`,
  `d${10}`,
  `d${8}`,
  `d${6}`,
  `d${4}`,
  'cat',
  'charm',
  'charm-2',
  'charm-3',
]
export const DICE = [20, 12, 10, 8, 6, 4]
export const colors: Record<number, string> = {
  20: 'rgba(56, 126, 255, 1)',
  12: '#7fdbca',
  10: '#ff7f50',
  8: '#f1c232',
  6: '#6f42c1',
  4: '#28a745',
}
