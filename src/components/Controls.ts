import { createElement } from '../utils/createElement'
import { doRoll, doRollCards, doSubmit, state } from '../state'

export const Controls = () => {
  const btnRoll = createElement('button', 'Roll') as HTMLButtonElement
  const btnRollCards = createElement(
    'button',
    'Roll Cards',
  ) as HTMLButtonElement
  const btnSubmit = createElement('button', 'Submit') as HTMLButtonElement
  const info = createElement('span', { className: 'info' }, '')
  const scoreInfo = createElement('span', { className: 'last-score' }, '')
  const gameButtons = createElement(
    'div',
    { className: 'buttons' },
    btnRoll,
    btnSubmit,
    btnRollCards,
  )
  const controls = createElement(
    'div',
    { className: 'controls' },
    gameButtons,
    info,
    scoreInfo,
  )

  const update = () => {
    btnRoll.toggleAttribute(
      'disabled',
      state.dice.every((d) => d.selected) || state.status !== 'ready',
    )
    btnSubmit.toggleAttribute(
      'disabled',
      state.dice.some((d) => typeof d.roll !== 'number'),
    )
    gameButtons.classList.toggle('hidden', state.status.includes('shop'))
    scoreInfo.textContent = `Last score: ${state.scoreInfo}`
    info.textContent =
      state.status === 'lost'
        ? 'You lose!'
        : `Round: ${state.round} You have ${state.lives} lives and ${state.chips} chips`
  }

  btnRoll.onclick = doRoll
  btnRollCards.onclick = doRollCards
  btnSubmit.onclick = doSubmit

  state.addUpdate('lives', update)
  state.addUpdate('status', update)
  state.addUpdate('chips', update)
  state.addUpdate('dice', update)
  update()

  return controls
}
