import { createElement } from '../utils/createElement'
import { applyDiceToCard, state } from '../utils/state'

export const Card = (index: number) => {
  const card = createElement('div', {
    className: 'card',
    onclick: () => applyDiceToCard(index),
  })
  const variant = createElement('div')
  const reward = createElement('div')
  const variantLabel = createElement('div')
  const multiLabel = createElement('div')
  const rewardLabel = createElement('div')
  const valueLabel = createElement('div')

  const update = () => {
    const card = state.cards[index]
    variantLabel.innerHTML = card.variant
    multiLabel.innerHTML = `x${card.multi}`
    rewardLabel.innerHTML = `${card.reward}`
    valueLabel.innerHTML = `${card.value}`
  }

  state.addUpdate('cards', update)
  update()

  variant.append(variantLabel, valueLabel)
  reward.append(rewardLabel, multiLabel)

  card.append(reward, variant)

  return card
}
