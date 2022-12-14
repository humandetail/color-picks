import { createElement } from '../../libs/dom'
import { RGBA } from '../../types'
import MemoryColors from './memory-colors'
import PopularColors from './popular-colors'
import StandardColors from './standard-colors'

export interface PresetColor {
  value: RGBA
  name?: string
}

export default class PresetPicker {
  el: HTMLDivElement | null = null

  render (parentElement: HTMLElement): void {
    const el = createElement('div', {
      class: 'color_picks__preset_picker__container'
    })

    const popularColors = new PopularColors()
    popularColors.render(el)

    const standardColors = new StandardColors()
    standardColors.render(el)

    const memoryColors = new MemoryColors()
    memoryColors.render(el)

    parentElement.appendChild(el)

    this.el = el
  }
}

// - 无填充颜色
// - 主题颜色
// - 标准色
// - 记忆色
