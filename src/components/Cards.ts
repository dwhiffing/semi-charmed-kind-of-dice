import { createElement } from '../utils/createElement'
import { state } from '../state'
import { getIsCardCompleted } from '../state/card'
import { getHandScore } from '../state/getHandScore'

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
  const container = createElement('div', { className: 'card' })
  const goalLabel = createElement('div', { className: 'goal' })
  const rewardLabel = createElement('div', { className: 'reward' })

  const update = () => {
    const _card = state.cards[index]
    const goal = _card.goal
    let len = 0
    let _goalLabel = ''
    if (goal.variant === 'sum') {
      _goalLabel = `sum ${goal.exact ? 'exactly' : 'at least'} ${goal.value}`
    } else if (goal.variant === 'set') {
      if (goal.specific)
        len = state.dice.filter((d) => d.roll === goal.value).length
      _goalLabel = goal.specific ? `${goal.value}s` : `${goal.value}OAK`
    } else if (goal.variant === 'run') {
      len = getHandScore().run?.length ?? 0
      _goalLabel = `run of ${goal.value}`
    }
    goalLabel.innerHTML = _goalLabel

    const renderRewardLabel = (label: string, className: string) =>
      rewardLabel.append(createElement('div', { className }, label))

    rewardLabel.innerHTML = ''
    if (_card.reward.scoreBase) {
      renderRewardLabel(`+${_card.reward.scoreBase}`, 'blue')
    }
    if (_card.reward.scoreMulti) {
      renderRewardLabel(`x${_card.reward.scoreMulti}`, 'red')
    }
    if (_card.reward.lengthBase) {
      renderRewardLabel(
        `+${len}x${_card.reward.lengthBase}=${len * _card.reward.lengthBase}`,
        'blue',
      )
    }
    if (_card.reward.lengthMulti) {
      renderRewardLabel(
        `+${len}x${_card.reward.lengthMulti}=${len * _card.reward.lengthMulti}`,
        'red',
      )
    }
    container.classList.toggle('completable', getIsCardCompleted(_card))
  }

  state.addUpdate('cards', update)
  state.addUpdate('dice', update)
  update()

  container.append(goalLabel, rewardLabel)

  return container
}
