import { createElement } from '../utils/createElement'
import { state } from '../state'
import { Cards } from './Cards'
import { Controls } from './Controls'
import { Menu } from './Menu'
import { Dice } from './Dice'
import { Passives } from './Passives'
import { Shop } from './Shop'

export const DiceGame = () => {
  const app = createElement('div', { className: 'dice-game' })

  app.append(Passives(), Shop(), Cards(), Dice(), Controls(), Menu())

  const update = () => {
    app.classList.toggle('shop-mode', state.status.includes('shop'))
  }
  state.addUpdate('status', update)

  return app
}
