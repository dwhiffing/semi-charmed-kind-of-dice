export function arraysHaveSameValues(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) return false
  const sorted1 = [...arr1].sort((a, b) => a - b)
  const sorted2 = [...arr2].sort((a, b) => a - b)
  return sorted1.every((val, i) => val === sorted2[i])
}

export const shuffle = <T>(array: T[]): T[] => {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
export const rollDie = (sides: number) =>
  sides < 1 ? 0 : Math.floor(Math.random() * sides) + 1

export const adjacentRange = (value: number, range: number): number[] => {
  const r = Math.max(1, Math.floor(range))

  // number of items on each side of `value` should sum to r-1
  const half = (r - 1) / 2
  let left = Math.floor(half)
  let right = Math.ceil(half)

  // if unbalanced (happens when r is even) randomly flip which side gets the extra
  if (left !== right && Math.random() < 0.5) {
    ;[left, right] = [right, left]
  }

  const out: number[] = []
  for (let i = value - left; i <= value + right; i++) out.push(i)
  return out
}
