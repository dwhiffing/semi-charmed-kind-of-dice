/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { createElement } from '../utils/createElement'
import { state } from '../utils/state'
import { Controls } from './Controls'
import { Die, DieSvgs } from './Die'

export const DiceGame = () => {
  const app = createElement('div', { className: 'dice-game' })
  const info = createElement('span', { className: 'info' }, '')

  const update = () => {
    info.textContent =
      state.status === 'lost'
        ? 'You rolled a 1 — you lose. Press Restart to try again.'
        : state.status === 'won'
        ? 'You completed all dice! Great job.'
        : 'Roll the current die. If you roll a 1 you lose'
  }

  state.addUpdate('status', update)

  update()

  app.append(info, DieSvgs(), Controls(), Die())

  return app
}
