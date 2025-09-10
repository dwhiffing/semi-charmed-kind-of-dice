import { state } from '../state'
import { createElement } from '../utils/createElement'
import { DieFace } from './Die'

export const Modal = () => {
  const overlay = createElement('div', { className: 'modal-overlay' })
  const modal = createElement('div', { className: 'modal' })
  const contentEl = createElement('div', { className: 'modal-content' })

  const closeModal = () => (state.selectedDie = -1)
  const buttonsEl = createElement('div', { className: 'modal-buttons' })
  const btn = createElement('button', { onclick: closeModal }, 'Close')

  overlay.onclick = (e) => e.target === overlay && closeModal()

  buttonsEl.appendChild(btn)
  modal.append(contentEl, buttonsEl)

  overlay.appendChild(modal)

  state.addUpdate('selectedDie', () => {
    const open = state.selectedDie !== -1
    overlay.classList.toggle('open', open)
    if (!open) return

    contentEl.innerHTML = ''
    for (let i = 1; i <= state.dice[state.selectedDie]?.sides; i++) {
      const { container, update } = DieFace()
      update(null, state.dice[state.selectedDie].sides, i, false, false)
      contentEl.append(container)
    }
  })

  return overlay
}
