import { createElement } from '../utils/createElement'
import { startGame, state } from '../state'

export const Menu = () => {
  const btnStart = createElement('button', 'Start Game') as HTMLButtonElement
  const title = createElement('h2', { className: 'title' }, 'Jynx Dice')
  const credits = createElement('div', 'By Daniel Whiffing')
  const lastScore = createElement('div', 'Last Score: 0')
  const highScore = createElement('div', 'High Score: 0')
  const buttons = createElement('div', { className: 'buttons' }, btnStart)

  const container = createElement(
    'div',
    { className: 'menu' },
    title,
    credits,
    lastScore,
    highScore,
    buttons,
  )

  const update = () => {
    const disabled = false
    btnStart.toggleAttribute('disabled', disabled)

    const visible = state.status !== 'menu' && state.status !== 'lost'
    container.style.opacity = visible ? '0' : '1'
    container.style.pointerEvents = visible ? 'none' : 'auto'
    credits.style.marginBottom = '10px'
    highScore.textContent = `High Score: ${state.highScore}`
    lastScore.textContent = `Last Score: ${state.points}`

    highScore.style.display = state.highScore ? 'block' : 'none'
    lastScore.style.display = state.points ? 'block' : 'none'
  }

  btnStart.onclick = () => startGame()

  state.addUpdate('points', update)
  state.addUpdate('status', update)
  update()

  return container
}
