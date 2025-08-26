import type { DeepHTMLElement, Tag } from './types'

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
