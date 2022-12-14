import { PresetColor } from '..'
import { createElement } from '../../../libs/dom'
import { getCheckedColor, getColorString } from '../../../libs/helper'

export default class MemoryColors {
  #colors: PresetColor[]

  el: HTMLElement | null = null

  constructor () {
    this.#colors = [
      { value: [192, 0, 0, 255], name: '深红' },
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

  render (parentElement: HTMLElement): void {
    const oWrapper = createElement('section', { class: 'memory-colors__wrapper' }, [
      createElement('h3', { class: 'memory-colors__title preset_picker__title' }, '记忆色'),
      createElement('ul', { class: 'memory-colors__colors' }, this.#colors.map(item => {
        return createElement('li', {
          class: 'memory-colors__color preset_picker__color',
          'data-color': getColorString(item.value, 'RGBA'),
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
      console.log(target.getAttribute('data-color'))
      // @todo 后续由数据来控制选中状态
      target.classList.add('checked')
    }
  }
}
