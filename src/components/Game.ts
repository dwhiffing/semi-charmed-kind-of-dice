import { createElement } from '../utils/createElement'
import { doRoll, state } from '../state'
import { Cards } from './Cards'
import { Controls } from './Controls'
import { Dice } from './Dice'
import { Passives } from './Passives'
import { Shop } from './Shop'
import { resetBoard } from '../state/card'
import { afterSubmitRollDelay } from '../constants'

export const DiceGame = () => {
  const app = createElement('div', { className: 'dice-game' })

  app.append(Shop(), Cards(), Dice(), Passives(), Controls())

  resetBoard()

  const update = () => {
    app.classList.toggle('shop-mode', state.status.includes('shop'))
  }
  state.addUpdate('status', update)
  setTimeout(() => doRoll(), afterSubmitRollDelay)

  return app
}
