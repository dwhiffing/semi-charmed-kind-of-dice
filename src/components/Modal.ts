import { state } from '../state'
import { createElement } from '../utils/createElement'
import { DieFace } from './Die'

export const Modal = () => {
  const overlay = createElement('div', { className: 'modal-overlay' })
  const modal = createElement('div', { className: 'modal' })
  const contentEl = createElement('div', { className: 'modal-content' })
  const contentNextEl = createElement('div', { className: 'modal-content' })
  const textEl = createElement('h3', 'Current Level:')
  const textNextEl = createElement('h3', 'Next Level:')

  const closeModal = () => (state.selectedDie = -1)
  const buttonsEl = createElement('div', { className: 'modal-buttons' })
  const btn = createElement('button', { onclick: closeModal }, 'Close')

  overlay.onclick = (e) => e.target === overlay && closeModal()

  buttonsEl.appendChild(btn)
  modal.append(textEl, contentEl, textNextEl, contentNextEl, buttonsEl)

  overlay.appendChild(modal)

  state.addUpdate('selectedDie', () => {
    const open = state.selectedDie !== -1
    overlay.classList.toggle('open', open)
    if (!open) return

    const sides = state.dice[state.selectedDie]?.sides

    contentEl.innerHTML = ''
    for (let i = 1; i <= sides; i++) {
      const { container, update } = DieFace()
      update(null, sides, i, false, false)
      contentEl.append(container)
    }

    if (sides <= 12) {
      contentNextEl.innerHTML = ''
      for (let i = 1; i <= sides + 2; i++) {
        const { container, update } = DieFace()
        update(null, sides + 2, i, false, false)
        contentNextEl.append(container)
      }
      textNextEl.innerText = 'Next Level:'
    } else {
      textNextEl.innerText = 'Max Level Reached'
    }
  })

  return overlay
}
