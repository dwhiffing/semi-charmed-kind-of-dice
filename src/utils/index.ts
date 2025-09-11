const pools = new Map<string, number[]>()

export const shuffle = <T>(array: T[]): T[] => {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export const rollDie = (sides: number, index: number) => {
  if (sides < 1) return 0
  const key = `${sides}-${index}`
  let pool = pools.get(key)
  if (!pool || pool.length === 0) {
    pool = []
    for (let i = 1; i <= sides; i++) pool.push(i, i, i)
    pool = shuffle(pool)
    pools.set(key, pool)
  }
  const val = pool.pop()!
  return val
}
