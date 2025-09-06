/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { createElement } from '../utils/createElement'
import {
  afterSubmitRollDelay,
  doRoll,
  resetBoard,
  resetDice,
  state,
} from '../utils/state'
import { Cards } from './Cards'
import { Controls } from './Controls'
import { Dice } from './Dice'
import { Shop } from './Shop'

export const DiceGame = () => {
  const app = createElement('div', { className: 'dice-game' })

  app.append(Shop(), Cards(), Dice(), Controls())

  resetBoard()
  resetDice()

  const update = () => {
    app.classList.toggle('shop-mode', state.status === 'shop')
  }
  state.addUpdate('status', update)
  setTimeout(() => doRoll(), afterSubmitRollDelay)

  return app
}
