/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { createElement } from '../utils/createElement'
import { resetBoard, resetDice, state } from '../utils/state'
import { Cards } from './Cards'
import { Controls } from './Controls'
import { Dice } from './Dice'

export const DiceGame = () => {
  const app = createElement('div', { className: 'dice-game' })
  const info = createElement('span', { className: 'info' }, '')

  const update = () => {
    info.textContent =
      state.status === 'lost'
        ? 'You lose!'
        : `You have ${state.lives} lives and ${state.chips} chips`
  }

  state.addUpdate('lives', update)
  state.addUpdate('status', update)
  state.addUpdate('chips', update)
  update()

  app.append(info, Cards(), Dice(), Controls())

  resetBoard()
  resetDice()

  return app
}
