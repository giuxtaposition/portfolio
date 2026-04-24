/**
 * Creates an element with passed tag name and appends it to the DOM.
 * @returns {HTMLElement}
 * @param {string} elementTagName
 * @param {{name: string, value?: any}[] | undefined} [attributes]
 */
export function createElement(elementTagName, attributes) {
  const el = document.createElement(elementTagName)
  attributes?.forEach((attribute) =>
    el.setAttribute(attribute.name, attribute.value),
  )
  document.body.appendChild(el)

  return el
}
