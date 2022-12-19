import { PresetColor } from '..'
import { createElement } from '../../../libs/dom'
import { getCheckedColor, getColorString, hex2rgba } from '../../../libs/helper'
import { ColorPicksState } from '../../../main'

export default class StandardColors {
  #colors: PresetColor[]

  el: HTMLElement | null = null

  state: ColorPicksState | null = null

  constructor () {
    this.#colors = [
      { value: [0, 0, 0, 0], name: '透明' },
      { value: [255, 0, 0, 255], name: '红色' },
      { value: [255, 192, 0, 255], name: '橙色' },
      { value: [255, 255, 0, 255], name: '黄色' },
      { value: [146, 208, 80, 255], name: '浅绿' },
      { value: [0, 176, 80, 255], name: '绿色' },
      { value: [0, 176, 240, 255], name: '浅蓝' },
      { value: [0, 112, 192, 255], name: '蓝色' },
      { value: [0, 32, 96, 255], name: '深蓝' },
      { value: [112, 48, 160, 255], name: '紫色' }
    ]
  }

  setState (state: ColorPicksState): void {
    this.state = state
  }

  render (parentElement: HTMLElement): void {
    const oWrapper = createElement('section', { class: 'standard-colors__wrapper' }, [
      createElement('h3', { class: 'standard-colors__title preset_picker__title' }, '标准色'),
      createElement('ul', { class: 'standard-colors__colors' }, this.#colors.map((item, index) => {
        return createElement('li', {
          class: `standard-colors__color preset_picker__color${index === 0 ? ' transparent' : ''}`,
          'data-color': getColorString(item.value),
          title: `${item.name ?? ''}(${getColorString(item.value)})`,
          style: `--color: ${getColorString(item.value)}; --checked-color: ${getCheckedColor(item.value)}`
        })
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
