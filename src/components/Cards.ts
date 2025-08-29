/** biome-ignore-all lint/style/noNonNullAssertion: xxx */
import { createElement } from '../utils/createElement'
import { state } from '../utils/state'
import { Card } from './Card'
// import { state } from '../utils/state'

export const Cards = () => {
  const cards = createElement('div', { className: 'cards' })

  const update = () => {
    if (cards.querySelectorAll('.card').length === state.cards.length) return
    cards.innerHTML = ''
    state.cards.forEach((_card, index) => {
      cards.append(Card(index))
    })
  }
  state.addUpdate('cards', update)

  return cards
}
