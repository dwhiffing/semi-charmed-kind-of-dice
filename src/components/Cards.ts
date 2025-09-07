import { createElement } from '../utils/createElement'
import { doSubmit, state } from '../state'

export const Cards = () => {
  const container = createElement('div', { className: 'cards' })

  const update = () => {
    if (container.querySelectorAll('.card').length === state.cards.length)
      return
    container.innerHTML = ''
    state.cards.forEach((_card, index) => container.append(Card(index)))
  }
  state.addUpdate('cards', update)

  return container
}

const Card = (index: number) => {
  const container = createElement('div', {
    className: 'card',
    onclick: () => doSubmit(index),
  })
  const goalLabel = createElement('div', { className: 'goal' })
  const rewardContainer = createElement('div', {
    className: 'reward-container',
  })
  const rewardLabel = createElement('div', { className: 'reward' })
  const scoreLabel = createElement('div', { className: 'score' })

  const update = () => {
    const _card = state.cards[index]
    if (!_card) return
    const reward = _card.reward()

    goalLabel.innerHTML = ''
    rewardLabel.innerHTML = ''
    scoreLabel.innerHTML = ''

    goalLabel.append(createElement('div', { className: '' }, _card.label))
    const label = reward.label ?? `${reward.value}`
    rewardLabel.append(
      createElement(
        'div',
        { className: reward.qualified ? 'bold' : 'muted' },
        label,
      ),
    )

    container.classList.toggle('completed', typeof _card.score === 'number')

    const isCompleted = typeof _card.score === 'number'
    const isZero = _card.score === 0

    scoreLabel.append(
      createElement(
        'div',
        {
          className: !isCompleted ? '' : isZero ? 'red' : 'blue',
          style: { opacity: _card.score === undefined ? '0.35' : '1' },
        },
        typeof _card.score === 'number'
          ? `${_card.score}`
          : `${reward.qualified ? reward.value : 0}`,
      ),
    )
  }

  state.addUpdate('cards', update)
  state.addUpdate('dice', update)
  update()

  rewardContainer.append(rewardLabel, scoreLabel)
  container.append(goalLabel, rewardContainer)

  return container
}
