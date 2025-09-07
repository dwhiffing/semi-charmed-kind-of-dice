/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { CARDS } from '../constants'

export const getNewCards = () => [
  CARDS.easySum(),
  CARDS.chance(),
  CARDS.easySetLength(),
  CARDS.easySetValue(),
  CARDS.easyRunLength(),
]
