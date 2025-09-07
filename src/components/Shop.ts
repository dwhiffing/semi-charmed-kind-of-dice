import { createElement } from '../utils/createElement'
import { buyItem, doNextRound, state } from '../state'
import type { Item } from '../types'
import {
  buyLives,
  buyPassivePack,
  buyNewDie,
  buyDieUpgrade,
  buyStickerPack,
  getPassivePool,
  getStickerPool,
} from '../state/shop'

export const Shop = () => {
  const container = createElement('div', { className: 'shop' })

  const update = () => {
    container.innerHTML = ''

    if (state.status === 'shop') {
      renderStoreButtons(container)
    } else if (state.status === 'shop-passive-pack') {
      renderPassivePackButtons(container)
    } else if (state.status === 'shop-sticker-pack') {
      renderStickerPackButtons(container)
    }

    if (state.status.match(/passive|sticker|upgrade/)) {
      const onSkip = () => (state.status = 'shop')
      renderButtons(
        [{ label: 'Skip', cost: () => 0, effect: onSkip }],
        container,
      )
    }

    if (state.status === 'shop-sticker-apply') {
      const label = `Apply sticker:${JSON.stringify(state.pendingSticker)}`
      container.append(createElement('div', {}, label))
    }
  }

  update()

  state.addUpdate('chips', update)
  state.addUpdate('dice', update)
  state.addUpdate('status', update)

  return container
}

const renderButtons = (items: Item[], el: HTMLElement) =>
  items.forEach((item) => {
    el.append(
      createElement(
        'button',
        { onclick: () => buyItem(item) },
        `${item.label}: cost: ${item.cost()}`,
      ),
    )
  })

const renderStoreButtons = (el: HTMLElement) => {
  renderButtons(
    [
      { label: 'Buy Lives X1', cost: () => 1, effect: () => buyLives(1) },
      { label: 'Buy Lives X5', cost: () => 4, effect: () => buyLives(5) },
      {
        label: 'Buy Passive Pack',
        cost: () => 8,
        effect: buyPassivePack,
      },
      {
        label: 'New Die',
        cost: () => Math.pow(10, state.dice.length - 1),
        effect: buyNewDie,
      },
      { label: 'Upgrade Die', cost: () => 0, effect: buyDieUpgrade },
      { label: 'Buy Sticker Pack', cost: () => 8, effect: buyStickerPack },
      { label: 'Exit Shop', cost: () => 0, effect: () => doNextRound() },
    ],
    el,
  )
}

const renderStickerPackButtons = (el: HTMLElement) => {
  const stickerPool = getStickerPool()
  const buySticker = (index: number) => {
    state.pendingSticker = stickerPool[index]
    state.status = 'shop-sticker-apply'
  }

  renderButtons(
    stickerPool.map((s, i) => ({
      label: `Buy Sticker ${JSON.stringify(s)}`,
      cost: () => 0,
      effect: () => buySticker(i),
    })),
    el,
  )
}

const renderPassivePackButtons = (el: HTMLElement) => {
  const passivePool = getPassivePool()

  const buyPassive = (index: number) => {
    if (state.passives.length >= 5) return
    state.passives = [...state.passives, passivePool[index]]
    state.status = 'shop'
  }

  renderButtons(
    passivePool.map((s, i) => ({
      label: `Buy Passive ${JSON.stringify(s)}`,
      cost: () => 0,
      effect: () => buyPassive(i),
    })),
    el,
  )
}
