import { createElement } from '../utils/createElement'
import { state } from '../state'

export const Passives = () => {
  const container = createElement('div', { className: 'passives' })

  const update = () => {
    container.innerHTML = ''
    for (let i = 0; i < 5; i++) {
      container.append(Passive(i))
    }
  }

  state.addUpdate('passives', update)
  update()

  return container
}

const Passive = (index: number) => {
  const container = createElement('div', {
    className: 'passive',
  }) as HTMLDivElement

  const update = () => {
    const _passive = state.passives[index]

    container.classList.toggle('empty', !_passive)
    if (!_passive) return
    container.innerText = '🍕'
  }

  state.addUpdate('passives', update)
  update()

  return container
}
