import { createElement } from './createElement'
import { clickSound } from './sounds'
import type { State } from './types'
import { zzfx } from './zzfx'

const Todo = (state: State, text: string, index: number) =>
  createElement(
    'li',
    { className: 'todo' },
    createElement('span', text),
    createElement(
      'button',
      {
        onclick: () => {
          const todos = Array.isArray(state.todos) ? [...state.todos] : []
          todos.splice(index, 1)
          state.todos = todos
        },
      },
      'x',
    ),
  )

export const TodoList = (state: State) => {
  const list = createElement('ul')

  state.addUpdate('todos', () => {
    list.innerHTML = ''
    if (Array.isArray(state.todos)) {
      state.todos.forEach((t: string, i: number) =>
        list.append(Todo(state, t, i)),
      )
    }
  })

  return list
}

export const CreateTodo = (state: State) => {
  const inp = createElement('input') as HTMLInputElement

  return createElement(
    'form',
    {
      onsubmit: (e: Event) => {
        e.preventDefault()

        zzfx(...clickSound)

        const todos = [...((state.todos as string[]) ?? [])]
        todos.push(inp.value)
        state.todos = todos
        inp.value = ''
      },
    },
    inp,
    createElement('input', { type: 'submit', value: 'Add Todo' }),
  )
}
