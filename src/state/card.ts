/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { state } from '.'
import { CARDS } from '../constants'

export const getNewCards = () => {
  if (state.round === 1)
    return [CARDS.easySum(), CARDS.easySetValue(), CARDS.chance()]

  if (state.round === 2)
    return [CARDS.easySetLength(), CARDS.easyRunLength(), CARDS.chance()]

  return [CARDS.chance()]
}
