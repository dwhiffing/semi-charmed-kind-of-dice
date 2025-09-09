import { createElement } from '../utils/createElement'
import { buyItem, state } from '../state'
import { Die } from './Die'
import { getDie } from '../state/die'

const buyDieItem = {
  cost: () => 5,
  label: 'test',
  effect: () => {
    state.dice = [...state.dice, getDie(4, state.dice.length)]
  },
}

export const Dice = () => {
  const dice = createElement('div', { className: 'dice' })
  const buyDieBtn = createElement(
    'button',
    {
      className: 'buy-die',
      onclick: () => buyItem(buyDieItem),
    },
    'Buy Die 5 Charms',
  )

  const updateDice = () => {
    if (dice.querySelectorAll('.die').length === state.dice.length) return

    dice.innerHTML = ''
    state.dice.forEach((_die, index) => dice.append(Die(index)))
    dice.append(buyDieBtn)
  }

  const updateStatus = () => {
    buyDieBtn.style.display = state.status === 'shop' ? 'block' : 'none'
    buyDieBtn.toggleAttribute('disabled', state.charms < buyDieItem.cost())
  }

  state.addUpdate('status', updateStatus)
  state.addUpdate('charms', updateStatus)
  state.addUpdate('dice', updateDice)

  return dice
}
