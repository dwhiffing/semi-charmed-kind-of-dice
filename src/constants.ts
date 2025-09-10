export const DEV = false

export const MAX_DICE = 8
export const initialDelay = DEV ? 100 : 450
export const perDieOffset = DEV ? 100 : 450
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
  20: '#ff7f50',
  12: '#f1c432ff',
  10: '#35c356ff',
  8: '#40c3ebff',
  6: '#3855f8ff',
  4: '#8051d5ff',
}
