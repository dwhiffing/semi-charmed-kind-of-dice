import { DiceGame } from './components/Game'
import { createElement } from './utils/createElement'
import { state } from './utils/state'

document.body.append(
  createElement('div', { className: 'game-root' }, DiceGame(state)),
)
