/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { createElement } from '../utils/createElement'
import { resetBoard, resetDice, state } from '../utils/state'
import { Cards } from './Cards'
import { Controls } from './Controls'
import { Dice } from './Dice'

export const DiceGame = () => {
  const app = createElement('div', { className: 'dice-game' })

  app.append(Cards(), Dice(), Controls())

  resetBoard()
  resetDice()

  return app
}
