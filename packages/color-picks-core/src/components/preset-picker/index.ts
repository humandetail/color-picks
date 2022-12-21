import { createElement } from '../../libs/dom'
import { getColorString, hex2rgba } from '../../libs/helper'
import { ColorPicksState } from '../..'
import { RGBA } from '../../types'
import MemoryColors from './memory-colors'
import PopularColors from './popular-colors'
import StandardColors from './standard-colors'

export interface PresetColor {
  value: RGBA
  name?: string
}

export interface PresetPickerContext {
  popularColors?: PopularColors
  standardColors?: StandardColors
  memoryColors?: MemoryColors
}

export default class PresetPicker {
  el: HTMLDivElement | null = null

  state: ColorPicksState

  context: PresetPickerContext = {}

  constructor (state: ColorPicksState) {
    this.state = state
  }

  setState (state: ColorPicksState): void {
    this.state = state
    if (this.context.popularColors) {
      this.context.popularColors.setState(state)
    }
    if (this.context.standardColors) {
      this.context.standardColors.setState(state)
    }
    if (this.context.memoryColors) {
      this.context.memoryColors.setState(state)
    }
    this.#setCheckedColor()
  }

  render (parentElement: HTMLElement): void {
    const el = createElement('div', {
      class: 'color_picks__preset_picker__container'
    })

    const popularColors = new PopularColors()
    popularColors.render(el)
    popularColors.setState(this.state)

    const standardColors = new StandardColors()
    standardColors.render(el)
    popularColors.setState(this.state)

    const memoryColors = new MemoryColors()
    memoryColors.render(el)
    popularColors.setState(this.state)

    parentElement.appendChild(el)

    this.context.popularColors = popularColors
    this.context.standardColors = standardColors
    this.context.memoryColors = memoryColors

    this.el = el

    this.#setCheckedColor()
  }

  #setCheckedColor (): void {
    if (this.el) {
      const oColors = this.el.querySelectorAll('.preset_picker__color')
      const oCheckedColor = this.el.querySelector('.preset_picker__color.checked')

      const currentColor = getColorString(this.state.currentColor)

      if (oCheckedColor) {
        if (PresetPicker.isSameColor(oCheckedColor.getAttribute('data-color') ?? '', currentColor)) {
          return
        }
        oCheckedColor.classList.remove('checked')
      }

      for (let i = oColors.length - 1; i >= 0; i--) {
        if (PresetPicker.isSameColor(oColors[i].getAttribute('data-color') ?? '', currentColor)) {
          oColors[i].classList.add('checked')
          break
        }
      }
    }
  }

  /**
   * @param color1 - Hex
   * @param color2 - Hex
   */
  static isSameColor (color1: string, color2: string): boolean {
    if (!color1.startsWith('#') || !color2.startsWith('#')) return false

    if (color1 === color2) return true

    const [r1, g1, b1, a1] = hex2rgba(color1)
    const [r2, g2, b2, a2] = hex2rgba(color2)

    // 透明通道为 0，transparent
    if (a1 === a2 && a1 === 0) return true

    return r1 === r2 && g1 === g2 && b1 === b2 && a1 === a2
  }
}
