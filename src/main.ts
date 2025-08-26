import { DiceGame } from './components'
import { createElement } from './createElement'
import { createState } from './createState'
import type { State } from './types'

const state = createState({
  dieIndex: 0,
  currentRoll: null,
  score: 0,
  status: 'ready',
}) as State

const app = createElement('div', { className: 'game-root' }, DiceGame(state))

document.body.append(app)
