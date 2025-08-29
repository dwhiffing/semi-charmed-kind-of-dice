/** biome-ignore-all lint/style/noNonNullAssertion: xxx */
import { createElement } from '../utils/createElement'
import { Die } from './Die'
import { state } from '../utils/state'

export const Dice = () => {
  const dice = createElement('div', { className: 'dice' })

  const update = () => {
    if (dice.querySelectorAll('.die').length === state.dice.length) return

    dice.innerHTML = ''
    state.dice.forEach((_die, index) => {
      dice.append(Die(index))
    })
  }

  state.addUpdate('dice', update)

  return dice
}
