import { createElement } from '../utils/createElement'
import { doExitShop, doRoll, doSubmit, state } from '../utils/state'

export const Controls = () => {
  const btnRoll = createElement('button', 'Roll') as HTMLButtonElement
  const btnSubmit = createElement('button', 'Submit') as HTMLButtonElement
  const btnExitShop = createElement('button', 'Exit') as HTMLButtonElement
  const info = createElement('span', { className: 'info' }, '')
  const lastScore = createElement('span', { className: 'last-score' }, '')
  const shopButtons = createElement(
    'div',
    { className: 'buttons' },
    btnExitShop,
  )
  const gameButtons = createElement(
    'div',
    { className: 'buttons' },
    btnRoll,
    btnSubmit,
  )
  const controls = createElement(
    'div',
    { className: 'controls' },
    shopButtons,
    gameButtons,
    info,
    lastScore,
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
    shopButtons.classList.toggle('hidden', state.status !== 'shop')
    gameButtons.classList.toggle('hidden', state.status === 'shop')
    lastScore.textContent = `Last score: ${state.lastScore}`
    info.textContent =
      state.status === 'lost'
        ? 'You lose!'
        : `Round: ${state.round} You have ${state.lives} lives and ${state.chips} chips`
  }

  btnRoll.onclick = doRoll
  btnSubmit.onclick = doSubmit
  btnExitShop.onclick = doExitShop

  state.addUpdate('lives', update)
  state.addUpdate('status', update)
  state.addUpdate('chips', update)
  state.addUpdate('dice', update)
  update()

  return controls
}
