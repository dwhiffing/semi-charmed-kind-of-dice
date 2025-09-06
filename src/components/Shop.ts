/** biome-ignore-all lint/style/noNonNullAssertion: xxx */
import { createElement } from '../utils/createElement'
import { buyItem, doNextRound, state } from '../state'
import { getDie } from '../state/die'
import type { Item, Sticker } from '../types'
// import { state } from '../utils/state'

const buyLives = (val: number) => {
  state.lives += val
}

const buyPassivePack = () => {
  state.status = 'shop-passive-pack'
}

const buyStickerPack = () => {
  state.status = 'shop-sticker-pack'
}

const buyDieUpgrade = () => {
  state.status = 'shop-die-upgrade'
}

const buyNewDie = () => {
  state.dice = [...state.dice, getDie(4, state.dice.length)]
}

export const Shop = () => {
  const shop = createElement('div', { className: 'shop' })

  const renderButtons = (items: Item[]) => {
    items.forEach((item) => {
      shop.append(
        createElement(
          'button',
          { onclick: () => buyItem(item) },
          `${item.label}: cost: ${item.cost()}`,
        ),
      )
    })
  }

  const update = () => {
    shop.innerHTML = ''

    if (state.status === 'shop') {
      renderButtons([
        { label: 'Buy Lives X1', cost: () => 1, effect: () => buyLives(1) },
        { label: 'Buy Lives X5', cost: () => 4, effect: () => buyLives(5) },
        {
          label: 'Buy Passive Pack',
          cost: () => 8,
          effect: () => buyPassivePack(),
        },
        {
          label: 'New Die',
          cost: () => Math.pow(10, state.dice.length - 1),
          effect: () => buyNewDie(),
        },
        {
          label: 'Upgrade Die',
          cost: () => 0,
          effect: () => buyDieUpgrade(),
        },
        {
          label: 'Buy Sticker Pack',
          cost: () => 8,
          effect: () => buyStickerPack(),
        },
        { label: 'Exit Shop', cost: () => 0, effect: () => doNextRound() },
      ])
    }

    if (state.status === 'shop-passive-pack') {
      renderButtons([
        {
          label: 'Buy Passive 1',
          cost: () => 0,
          effect: () => {
            state.status = 'shop'
          },
        },
        {
          label: 'Buy Passive 2',
          cost: () => 0,
          effect: () => {
            state.status = 'shop'
          },
        },
        {
          label: 'Buy Passive 3',
          cost: () => 0,
          effect: () => {
            state.status = 'shop'
          },
        },
      ])
    }

    if (state.status === 'shop-sticker-pack') {
      // TODO: randomize stickers each time a pack is opened
      const stickerPool: Sticker[] = [
        { type: 'number', rollValue: -1, value: 4 },
        { type: 'number', rollValue: -1, value: 2 },
        { type: 'number', rollValue: -1, value: 3 },
      ]
      const buySticker = (index: number) => {
        state.pendingSticker = stickerPool[index]
        state.status = 'shop-sticker-apply'
      }

      renderButtons([
        {
          label: `Buy Sticker ${JSON.stringify(stickerPool[0])}`,
          cost: () => 0,
          effect: () => buySticker(0),
        },
        {
          label: `Buy Sticker ${JSON.stringify(stickerPool[1])}`,
          cost: () => 0,
          effect: () => buySticker(1),
        },
        {
          label: `Buy Sticker ${JSON.stringify(stickerPool[2])}`,
          cost: () => 0,
          effect: () => buySticker(2),
        },
      ])
    }

    if (state.status.match(/passive|sticker|upgrade/)) {
      renderButtons([
        { label: 'Skip', cost: () => 0, effect: () => (state.status = 'shop') },
      ])
    }

    if (state.status === 'shop-sticker-apply') {
      shop.append(
        createElement(
          'div',
          {},
          `Apply sticker:${JSON.stringify(state.pendingSticker)}`,
        ),
      )
    }
  }

  update()

  state.addUpdate('chips', update)
  state.addUpdate('dice', update)
  state.addUpdate('status', update)

  return shop
}
