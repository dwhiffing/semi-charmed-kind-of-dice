import { createElement } from '../utils/createElement'
import { startGame, state } from '../state'
import { Controls } from './Controls'
import { Menu } from './Menu'
import { Dice } from './Dice'
import { DEV } from '../constants'
import { Modal } from './Modal'

export const DiceGame = () => {
  const app = createElement(
    'div',
    { className: 'dice-game' },
    Modal(),
    Dice(),
    Controls(),
    Menu(),
  )
  const container = createElement(
    'div',
    { className: 'dice-game-container' },
    app,
  )

  const update = () => {
    app.classList.toggle('shop-mode', state.status.includes('shop'))
  }
  state.addUpdate('status', update)

  if (DEV) startGame()

  return container
}
