import { SVGS } from './constants'
import { DiceGame } from './components/Game'
import { createElement } from './utils/createElement'
import { playMusic } from './utils/zzfx'

const svgs = createElement('div', { className: 'svgs hidden' }, '')

await Promise.all(
  SVGS.map(async (svg) => {
    const res = await fetch(`/${svg}.svg`)
    const innerHTML = (await res.text()).trim()
    svgs.append(createElement('div', { id: `${svg}`, innerHTML }))
  }),
)

document.body.append(svgs)
document.body.append(DiceGame())

const handleFirstInteraction = () => {
  setTimeout(playMusic, 10)
  document.removeEventListener('pointerdown', handleFirstInteraction)
}

document.addEventListener('pointerdown', handleFirstInteraction)
