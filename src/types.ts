export type GoalVariant =
  | 'equal'
  | 'sum'
  | 'difference'
  | 'odd'
  | 'even'
  | 'set'
  | 'run'

export type Card = {
  goal: GoalVariant
  value: number | number[]
}

export type Die = {
  sides: number
  selected: boolean
  roll: number | null
  status: 'rolling' | 'ready'
}

export type Item = {
  label: string
  cost: number
  effect: () => void
}

export interface IState extends State {
  dice: Die[]
  cards: Card[]
  lives: number
  chips: number
  goalsCompleted: number
  status: 'ready' | 'rolling' | 'won' | 'lost'
}

export type DeepHTMLElement = HTMLElement & { [key: string]: unknown }
export type Tag =
  | 'a'
  | 'br'
  | 'button'
  | 'dialog'
  | 'div'
  | 'form'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'head'
  | 'header'
  | 'hr'
  | 'html'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'main'
  | 'meta'
  | 'nav'
  | 'option'
  | 'p'
  | 'pre'
  | 'script'
  | 'section'
  | 'select'
  | 'span'
  | 'strong'
  | 'style'
  | 'svg'
  | 'table'
  | 'tbody'
  | 'td'
  | 'textarea'
  | 'th'
  | 'thead'
  | 'title'
  | 'ul'
  | 'video'

export type State = Record<string, unknown> & {
  _updates: Record<string, Array<() => void>>
  _update: (s: string) => void
  addUpdate: (s: string, u: () => void) => void
}
export type StateProxy = {
  [key: string]: unknown
  _updates: Record<string, Array<() => void>>
  _update: (s: string) => void
  addUpdate: (s: string, u: () => void) => void
}
