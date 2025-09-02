/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { createElement } from '../utils/createElement'
import { resetBoard, resetDice } from '../utils/state'
import { Cards } from './Cards'
import { Controls } from './Controls'
import { Dice } from './Dice'
import { Shop } from './Shop'

export const DiceGame = () => {
  const app = createElement('div', { className: 'dice-game' })

  app.append(Shop(), Cards(), Dice(), Controls())

  resetBoard()
  resetDice()

  return app
}
