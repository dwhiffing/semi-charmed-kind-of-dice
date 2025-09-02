/** biome-ignore-all lint/style/noNonNullAssertion: xxx */
import { createElement } from '../utils/createElement'
import { buyItem, state } from '../utils/state'
// import { state } from '../utils/state'

export const Shop = () => {
  const shop = createElement('div', { className: 'shop' })

  const items = [
    { label: 'Buy Lives X1', cost: 1, effect: () => state.lives++ },
    { label: 'Buy Lives X5', cost: 4, effect: () => (state.lives += 5) },
    { label: 'Buy Lives X10', cost: 8, effect: () => (state.lives += 10) },
  ]

  items.forEach((item) => {
    const itemElement = createElement(
      'button',
      {
        className: 'shop-item',
        onclick: () => buyItem(item),
      },
      item.label,
    )
    shop.append(itemElement)
  })

  const update = () => {
    console.log(state.chips)
  }

  state.addUpdate('chips', update)

  return shop
}
