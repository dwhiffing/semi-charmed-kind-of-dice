import { SVGS } from './constants'
import { DiceGame } from './components/Game'
import { createElement } from './utils/createElement'

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
