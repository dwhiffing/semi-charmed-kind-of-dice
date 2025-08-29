import { DiceGame } from './components'
import { createElement } from './createElement'
import { createState } from './createState'
import type { State } from './types'

export interface IState extends State {
  dieIndex: number
  currentRoll: number | null
  status: 'ready' | 'rolling' | 'won' | 'lost'
}

const state = createState({
  dieIndex: 0,
  currentRoll: null,
  status: 'ready',
}) as IState

const app = createElement('div', { className: 'game-root' }, DiceGame(state))

document.body.append(app)
