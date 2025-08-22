import type { DeepHTMLElement, State, StateProxy, Tag } from './types'

const assignDeep = (elm: DeepHTMLElement, props: Record<string, unknown>) =>
  Object.entries(props).forEach(([key, value]) => {
    if (
      typeof value === 'object' &&
      value !== null &&
      key in elm &&
      typeof (elm as DeepHTMLElement)[key] === 'object'
    ) {
      return assignDeep(
        (elm as DeepHTMLElement)[key] as DeepHTMLElement,
        value as Record<string, unknown>,
      )
    }
    try {
      Object.assign(elm, { [key]: value })
    } catch {
      elm.setAttribute(key, String(value))
    }
  })

export const createElement = (
  tag: Tag,
  ...args: (Record<string, unknown> | HTMLElement | string)[]
) => {
  const props =
    typeof args[0] === 'object' && !(args[0] instanceof HTMLElement)
      ? (args.shift() as Record<string, unknown>)
      : null
  const elm = document.createElement(tag)
  if (props) assignDeep(elm as DeepHTMLElement, props)
  elm.append(
    ...args
      .filter((a) => typeof a === 'string' || a instanceof Node)
      .map((a) =>
        typeof a === 'string' ? document.createTextNode(a) : (a as Node),
      ),
  )
  return elm
}

export const createState = (state: Record<string, unknown>) => {
  const _updates: Record<string, Array<() => void>> = Object.fromEntries(
    Object.keys(state).map((s) => [s, []]),
  )
  const _update = (s: string) => _updates[s].forEach((u) => u())
  const addUpdate = (s: string, u: () => void) => _updates[s].push(u)
  return new Proxy({ ...state, _updates, _update, addUpdate } as StateProxy, {
    set(o, p, v) {
      if (typeof p === 'string') {
        ;(o as StateProxy)[p] = v
        o._update(p)
        return true
      }
      return false
    },
  }) as State
}

function Todo(state: State, text: string, index: number) {
  return createElement(
    'li',
    createElement('span', { style: { color: 'white' } }, text),
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
}

function TodoList(state: State) {
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

function CreateTodo(state: State) {
  const inp = createElement('input') as HTMLInputElement
  return createElement(
    'form',
    {
      onsubmit: (e: Event) => {
        e.preventDefault()
        const todos = Array.isArray(state.todos) ? [...state.todos] : []
        todos.push(inp.value)
        state.todos = todos
        inp.value = ''
      },
    },
    inp,
    createElement('input', { type: 'submit', value: 'Add Todo' }),
  )
}
function TodoApp() {
  const state = createState({ todos: [] }) as State

  return createElement(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      },
    },
    CreateTodo(state),
    TodoList(state),
  )
}

document.body.append(TodoApp())
