/** biome-ignore-all lint/style/noNonNullAssertion: xxx */
import { createElement } from '../utils/createElement'
import { getIsCardCompleted, state } from '../utils/state'

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

const Card = (index: number) => {
  const card = createElement('div', { className: 'card' })
  const variant = createElement('div')
  const variantLabel = createElement('div')
  const valueLabel = createElement('div')

  const update = () => {
    const _card = state.cards[index]
    variantLabel.innerHTML = `${_card.goal}:`
    valueLabel.innerHTML = `${_card.value}`

    card.classList.toggle('completable', getIsCardCompleted(_card))
  }

  state.addUpdate('cards', update)
  state.addUpdate('dice', update)
  update()

  variant.append(variantLabel, valueLabel)

  card.append(variant)

  return card
}
