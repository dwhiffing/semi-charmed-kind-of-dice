import { createElement } from '../utils/createElement'
import { startGame, state } from '../state'
import { Controls } from './Controls'
import { Menu } from './Menu'
import { Dice } from './Dice'
import { DEV } from '../constants'

export const DiceGame = () => {
  const app = createElement('div', { className: 'dice-game' })

  app.append(Dice(), Controls(), Menu())

  const update = () => {
    app.classList.toggle('shop-mode', state.status.includes('shop'))
  }
  state.addUpdate('status', update)

  if (DEV) startGame()

  return app
}
