export type GoalVariant = 'set' | 'sum' | 'run'

export type Passive = {
  variant: 'basic'
}

export type Reward = {
  lengthMulti?: number // add to scoreMulti: length * lengthMulti
  lengthBaseMulti?: number // add to scoreBase: length * lengthBaseMulti
  scoreBase?: number // static value to add to scoreBase
  multiBase?: number // static value to add to multiBase
}

export type Goal =
  | { variant: 'set'; length?: number; value?: number } // (set.length >= length)||set[0] === value && set.length >=length||(set[0] === value)
  | { variant: 'run'; length?: number; value?: [number] } // run.length >= length||run === value
  | { variant: 'sum'; value: number; exact: boolean } // sum >= value || sum === value

// type Goal =
// { goal: 'set', length: number }| // set.length >= length
// { goal: 'set', length: number, value: number }| // set[0] === value && set.length >=length
// { goal: 'set', value: number }| // set[0] === value
// { goal: 'run', length: number }| // run.length >= length
// { goal: 'run', value: [number] }| // run === value
// { goal: 'sum', value: number }| // sum >= value
// { goal: 'sum', value: number, exact: boolean } // sum === value

export type Card = {
  goals: Goal[]
  reward: Reward
}

export type Sticker = {
  variant: 'number'
  rollValue: number
  value: number
}
export type Die = {
  sides: number
  index: number
  selected: boolean
  roll: number | null
  status: 'rolling' | 'ready'
  stickers: Sticker[]
}

export type Item = {
  label: string
  cost: () => number
  effect: () => void
}

export interface IState extends State {
  dice: Die[]
  cards: Card[]
  cardPool: Card[]
  lives: number
  chips: number
  scoreBase: number
  scoreMulti: number
  round: number
  scoreInfo: string
  passives: Passive[]
  pendingSticker: Sticker | null
  status:
    | 'ready'
    | 'rolling'
    | 'won'
    | 'lost'
    | 'shop'
    | 'shop-die-upgrade'
    | 'shop-sticker-pack'
    | 'shop-passive-pack'
    | 'shop-sticker-apply'
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
