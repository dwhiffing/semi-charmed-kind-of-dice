import { CreateTodo, TodoList } from './components'
import { createElement } from './createElement'
import { createState } from './createState'
import type { State } from './types'

const state = createState({ todos: [] }) as State
const app = createElement(
  'div',
  { className: 'todo-app' },
  CreateTodo(state),
  TodoList(state),
)

document.body.append(app)
