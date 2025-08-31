import { createElement } from '../utils/createElement'
import { checkGoal, state } from '../utils/state'

export const Card = (index: number) => {
  const card = createElement('div', { className: 'card' })
  const variant = createElement('div')
  const reward = createElement('div')
  const variantLabel = createElement('div')
  const multiLabel = createElement('div')
  const rewardLabel = createElement('div')
  const valueLabel = createElement('div')

  const update = () => {
    const _card = state.cards[index]
    variantLabel.innerHTML = `${_card.goal}:`
    valueLabel.innerHTML = `${_card.value}`
    rewardLabel.innerHTML = `${_card.reward}`
    multiLabel.innerHTML = `x${_card.multi}`
    card.classList.toggle('completable', checkGoal(_card))
  }

  state.addUpdate('cards', update)
  state.addUpdate('dice', update)
  update()

  variant.append(variantLabel, valueLabel)
  reward.append(rewardLabel, multiLabel)

  card.append(reward, variant)

  return card
}
