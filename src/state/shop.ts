import { state } from '../state'
import { getDie } from '../state/die'
import type { Passive, Sticker } from '../types'

export const buyLives = (val: number) => (state.lives += val)
export const buyPassivePack = () => (state.status = 'shop-passive-pack')
export const buyStickerPack = () => (state.status = 'shop-sticker-pack')
export const buyDieUpgrade = () => (state.status = 'shop-die-upgrade')
export const buyNewDie = () =>
  (state.dice = [...state.dice, getDie(4, state.dice.length)])

export const getStickerPool = (): Sticker[] => [
  { variant: 'number', rollValue: -1, value: 4 },
  { variant: 'number', rollValue: -1, value: 2 },
  { variant: 'number', rollValue: -1, value: 3 },
]

export const getPassivePool = (): Passive[] => [
  { variant: 'basic' },
  { variant: 'basic' },
  { variant: 'basic' },
]
