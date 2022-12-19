import { PresetColor } from '..'
import colorsConfig from '../../../config/colors.config'
import { createElement } from '../../../libs/dom'
import { getCheckedColor, getColorString, hex2rgba } from '../../../libs/helper'
import { ColorPicksState } from '../../../main'

export default class PopularColors {
  el: HTMLElement | null = null

  #colors: PresetColor[][]

  state: ColorPicksState | null = null

  constructor () {
    this.#colors = [
      colorsConfig.gray.map((item, index) => ({ value: hex2rgba(item), name: `gray-${index}` })),
      colorsConfig.red.map((item, index) => ({ value: hex2rgba(item), name: `red-${index}` })),
      colorsConfig.orange.map((item, index) => ({ value: hex2rgba(item), name: `orange-${index}` })),
      colorsConfig.yellow.map((item, index) => ({ value: hex2rgba(item), name: `yellow-${index}` })),
      colorsConfig.green.map((item, index) => ({ value: hex2rgba(item), name: `green-${index}` })),
      colorsConfig.cyan.map((item, index) => ({ value: hex2rgba(item), name: `cyan-${index}` })),
      colorsConfig.blue.map((item, index) => ({ value: hex2rgba(item), name: `blue-${index}` })),
      colorsConfig.geekblue.map((item, index) => ({ value: hex2rgba(item), name: `geekblue-${index}` })),
      colorsConfig.purple.map((item, index) => ({ value: hex2rgba(item), name: `purple-${index}` })),
      colorsConfig.magenta.map((item, index) => ({ value: hex2rgba(item), name: `magenta-${index}` }))
    ]
  }

  setState (state: ColorPicksState): void {
    this.state = state
  }

  render (parentElement: HTMLElement): void {
    const oWrapper = createElement('section', { class: 'popular-colors__wrapper' }, [
      createElement('h3', { class: 'popular-colors__title preset_picker__title' }, '主题颜色'),
      createElement('div', { class: 'popular-colors__list' }, this.#colors.map(columns => {
        return createElement('ul', { class: 'popular-colors__colors' }, columns.map(item => {
          return createElement('li', {
            class: 'popular-colors__color preset_picker__color',
            'data-color': getColorString(item.value),
            title: `${item.name ?? ''}(${getColorString(item.value)})`,
            style: `--color: ${getColorString(item.value)}; --checked-color: ${getCheckedColor(item.value)}`
          })
        }))
      }))
    ])

    this.el = oWrapper

    parentElement.appendChild(oWrapper)

    this.#initEvent()
  }

  #initEvent (): void {
    if (this.el) {
      this.el.addEventListener('click', this.#handleClick, false)
    }
  }

  #handleClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement

    if (target.classList.contains('preset_picker__color')) {
      const color = target.getAttribute('data-color')
      if (this.state && color) {
        this.state.currentColor = hex2rgba(color)
        this.state.confirm()
      }
    }
  }
}
