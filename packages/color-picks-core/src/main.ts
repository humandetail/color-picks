import ColorPicker from './components/color-picker'
import PresetPicker from './components/preset-picker'

import './assets/styles/index.scss'
import PanelSwitcher, { PanelType } from './components/panel-switcher'
import { createElement } from './libs/dom'
import EventEmitter from './libs/EventEmitter'
import { OutputType, RGBA } from './types'
import PickingArea from './components/color-picker/picking-area'
import MainColorBar from './components/color-picker/main-color-bar'
import AlphaBar from './components/color-picker/alpha-bar'
import OperationsArea from './components/color-picker/operations-area'
import { getColorString, hex2number } from './libs/helper'
import { MEMORY_COLORS_KEY } from './config'
import PopularColors from './components/preset-picker/popular-colors'
import MemoryColors from './components/preset-picker/memory-colors'
import StandardColors from './components/preset-picker/standard-colors'

export interface ColorPicksState {
  initialValue: RGBA
  mainColor: RGBA
  currentColor: RGBA
  setCurrentFlag: boolean
  panel: PanelType
  confirm: () => void
  cancel: () => void
}

export interface ColorPicksContext {
  el?: HTMLDivElement

  panelSwitcher?: PanelSwitcher
  presetPicker?: PresetPicker
  colorPicker?: ColorPicker
  pickingArea?: PickingArea
  mainColorBar?: MainColorBar
  alphaBar?: AlphaBar
  operationsArea?: OperationsArea

  popularColors?: PopularColors
  standardColors?: StandardColors
  memoryColors?: MemoryColors
}

export interface ColorPicksOptions {
  outputType?: OutputType
}

export default class ColorPicks extends EventEmitter {
  #state: ColorPicksState
  #context: ColorPicksContext = {}

  options: ColorPicksOptions

  constructor (options: ColorPicksOptions = {}) {
    super()

    this.options = Object.assign({}, {
      outputType: 'HEX'
    }, options)

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this

    this.#state = new Proxy({
      initialValue: [255, 255, 255, 255],
      mainColor: [255, 0, 0, 255],
      currentColor: [255, 255, 255, 255],
      setCurrentFlag: true,
      panel: 'PresetPicker',
      confirm: _this.#confirm,
      cancel: _this.#cancel
    }, {
      get (target, key) {
        return Reflect.get(target, key)
      },

      set (target, key, value) {
        const oldValue = Reflect.get(target, key)
        const result = Reflect.set(target, key, value)

        switch (key) {
          case 'panel':
            _this.#handlePanelChange(value as PanelType)
            break
          case 'initialValue':
            _this.#handleInitialValueChange(value as RGBA)
            break
          case 'mainColor':
            _this.#handleMainColorChange(value as RGBA, oldValue as RGBA)
            break
          case 'currentColor':
            _this.#handleCurrentColorChange()
            _this.#handleAlphaChange()
            break
          // case 'alpha':
          //   _this.#handleAlphaChange(value as number)
          //   break
          case 'setCurrentFlag':
            _this.state.mainColor = _this.#calculateMainColor(_this.state.currentColor)
            break
          default:
            break
        }

        return result
      }
    })
  }

  get state (): ColorPicksState {
    return this.#state
  }

  setColor (color: string): ColorPicks {
    if (color.startsWith('#')) {
      let val = color.slice(1)
      if (![3, 6, 8].includes(val.length)) {
        // eslint-disable-next-line no-console
        console.error(`'color' expects a hexadecimal color or an rgb color, but got '${color}'`)
        return this
      }

      switch (val.length) {
        case 3:
          val = val.split('').reduce((prev, item) => prev + item.repeat(2), '') + 'FF'
          break
        case 6:
          val += 'FF'
          break
        default:
          break
      }

      const match = val.match(/(.{2})(.{2})(.{2})(.{2})/)

      if (match) {
        this.state.initialValue = match.slice(1).map(v => hex2number(v)) as RGBA
      }
    } else if (/^rgb/i.test(color)) {
      // @todo
      const match = color.match(/^rgba?\((.+?)\)/)

      if (match) {
        const arr = match[1].split(',').map(Number).filter(v => !isNaN(v))

        if (arr.length >= 3 && arr.length <= 4) {
          if (arr.length === 3) {
            this.state.initialValue = [
              ...arr.map(v => Math.min(255, Math.max(0, v))),
              255
            ] as unknown as RGBA
          } else if (arr.length === 4) {
            const alpha = arr.pop()!
            this.state.initialValue = [
              ...arr.map(v => Math.min(255, Math.max(0, v))),
              Math.round(alpha * 255)
            ] as unknown as RGBA
          }
        }

        // this.state.initialValue = match.slice(1).map(v => !v ? 255 : Math.min(255, Math.max(0, Number(v)))) as RGBA
      }
    } else if (color === 'transparent') {
      this.state.initialValue = [0, 0, 0, 0]
    } else {
      // eslint-disable-next-line no-console
      console.error(`'value' expects a hexadecimal color or an rgb color, but got '${color}'`)
    }
    return this
  }

  mount (el: HTMLElement): ColorPicks {
    const oColorPicks = createElement('div', {
      class: 'color-picks__container'
    })

    const colorPicker = new ColorPicker(this.state)
    colorPicker.render(oColorPicks)

    const presetPicker = new PresetPicker(this.state)
    presetPicker.render(oColorPicks)

    const panelSwitcher = new PanelSwitcher()
    panelSwitcher.render(oColorPicks)
    panelSwitcher.setState(this.state)

    el.appendChild(oColorPicks)

    this.#context = {
      ...this.#context,
      el: oColorPicks,
      panelSwitcher,
      presetPicker,
      colorPicker,
      ...colorPicker.context,
      ...presetPicker.context
    }

    this.#handlePanelChange(this.state.panel)

    if (this.#context.pickingArea) {
      this.#context.pickingArea.setState(this.state, true, true)
    }

    return this
  }

  #confirm = (): void => {
    console.log('confirm', this)
    this.#setMemoryColors()

    this.emit('confirm', getColorString(this.state.currentColor, this.options.outputType))
  }

  #cancel = (): void => {
    console.log('cancel', this)
    this.emit('cancel')
  }

  #setMemoryColors (): void {
    let memoryColors: RGBA[] = JSON.parse(localStorage.getItem(MEMORY_COLORS_KEY) ?? '[]') || []

    // 过滤非法数据
    memoryColors = memoryColors.filter(color => Array.isArray(color) && color.length === 4 && getColorString(color) !== getColorString(this.state.currentColor))

    memoryColors.unshift(this.state.currentColor)

    if (memoryColors.length > 10) {
      memoryColors.length = 10
    }

    localStorage.setItem(MEMORY_COLORS_KEY, JSON.stringify(memoryColors))

    if (this.#context.memoryColors) {
      this.#context.memoryColors.setColor()
    }

    console.log('set memory', memoryColors)
  }

  #handlePanelChange (type: PanelType): void {
    if (this.#context.panelSwitcher) {
      this.#context.panelSwitcher.setState(this.state)
    }
    if (this.#context.presetPicker?.el && this.#context.colorPicker?.el) {
      switch (type) {
        case 'ColorPicker':
          this.#context.presetPicker.el.style.visibility = 'hidden'
          this.#context.colorPicker.el.style.visibility = 'visible'
          this.state.mainColor = this.#calculateMainColor(this.state.currentColor)
          // this.#handleCurrentColorChange()
          break
        case 'PresetPicker':
          this.#context.presetPicker.el.style.visibility = 'visible'
          this.#context.colorPicker.el.style.visibility = 'hidden'
          break
        default:
          break
      }
    }
  }

  #handleInitialValueChange (val: RGBA): void {
    this.state.currentColor = [...val]
    // this.state.alpha = val.at(-1) ?? 255

    this.state.mainColor = this.#calculateMainColor(val)
  }

  /**
   * @param val - current color
   */
  #calculateMainColor (val: RGBA): RGBA {
    const [r, g, b] = val
    // 1. 排除 3 值或 2 值相等的情况
    if (r === g && r === b) {
      return [255, 0, 0, 255]
    } else if (r === g) {
      return r > b ? [255, 255, 0, 255] : [0, 0, 255, 255]
    } else if (r === b) {
      return r > g ? [255, 0, 255, 255] : [0, 255, 0, 255]
    } else if (g === b) {
      return g > r ? [0, 255, 255, 255] : [255, 0, 0, 255]
    }
    // 2. 最大值必定是255
    const mMax = 255
    const cMin = Math.min(r, g, b)
    const cMax = Math.max(r, b, b)
    const cMid = [r, g, b].filter(item => item !== cMin && item !== cMax)[0] as unknown as number

    // left: 1 - cMin / cMax
    const left = 1 - cMin / cMax
    // top: (mMax - cMax) / mMax
    const top = (mMax - cMax) / mMax
    // cMid = (mMax - (mMax - mMid) * left) * (1 - top)
    const mMid = (mMax * left - mMax + cMid / (1 - top)) / left

    // 3. 取索引值进行排序
    const sortKeys = Object.keys([r, g, b]).map(Number).sort((a, b) => val[b]! - val[a]!)
    const mainColor: RGBA = [0, 0, 0, 255]

    mainColor[sortKeys.shift()!] = mMax
    mainColor[sortKeys.shift()!] = Math.round(mMid)
    mainColor[sortKeys.shift()!] = 0

    return mainColor
  }

  #handleMainColorChange (newValue: RGBA, oldValue: RGBA): void {
    if (this.#context.pickingArea) {
      this.#context.pickingArea.setState(this.state, true, JSON.stringify(newValue.slice(0, 3)) !== JSON.stringify(oldValue.slice(0, 3)))
    }
    if (this.#context.mainColorBar) {
      this.#context.mainColorBar.setState(this.state)
    }
  }

  #handleCurrentColorChange (): void {
    if (this.#context.pickingArea) {
      this.#context.pickingArea.setState(this.state, true)
    }
    if (this.#context.operationsArea) {
      this.#context.operationsArea.setState(this.state)
    }
    if (this.#context.alphaBar) {
      this.#context.alphaBar.setState(this.state)
    }

    if (this.#context.presetPicker) {
      this.#context.presetPicker.setState(this.state)
    }
  }

  #handleAlphaChange (): void {
    // this.state.currentColor = [this.state.currentColor[0], this.state.currentColor[1], this.state.currentColor[2], val]

    if (this.#context.alphaBar) {
      this.#context.alphaBar.setState(this.state)
    }
  }
}

const colorPicks = new ColorPicks()

colorPicks.setColor('rgba(255, 0, 0, 0)').mount(document.querySelector('#app')!)

colorPicks.on('confirm', (color: string) => {
  console.log('confirm', color)
})
