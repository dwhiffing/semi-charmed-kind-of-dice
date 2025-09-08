export const DEV = true

export const initialDelay = DEV ? 250 : 150
export const perDieOffset = DEV ? 50 : 500
export const afterSubmitRollDelay = DEV ? 50 : 500

export const SVGS = [
  `d${20}`,
  `d${12}`,
  `d${10}`,
  `d${8}`,
  `d${6}`,
  `d${4}`,
  'cat',
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
