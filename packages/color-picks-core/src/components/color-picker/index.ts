import { createElement } from '../../libs/dom'
import { hex2number } from '../../libs/helper'
import { RGBA } from '../../types'

import PickingArea from './picking-area'
import MainColorBar from './main-color-bar'
import AlphaBar from './alpha-bar'
import OperationsArea from './operations-area'

export interface ColorPickerState {
  initialValue: RGBA
  mainColor: RGBA
  currentColor: RGBA
  alpha: number
  setCurrentFlag: boolean
}

export default class ColorPicker {
  #initialValue: RGBA = [255, 255, 255, 255]
  #mainColor: RGBA = [255, 0, 0, 255]
  #currentColor: RGBA = [255, 255, 255, 255]
  #alpha: number = 255

  el: HTMLDivElement | null = null

  context: {
    pickingArea?: PickingArea
    mainColorBar?: MainColorBar
    alphaBar?: AlphaBar
    operationsArea?: OperationsArea
  } & Record<string, any> = {}

  constructor (initialValue?: string) {
    if (initialValue) {
      this.setValue(initialValue)
    }
  }

  get initialValue (): RGBA {
    return this.#initialValue
  }

  set initialValue (val: RGBA) {
    this.#initialValue = val
    this.currentColor = [...val]
    this.alpha = val.at(-1) ?? 255

    this.mainColor = this.#calculateMainColor(val)
  }

  get mainColor (): RGBA {
    return this.#mainColor
  }

  set mainColor (val: RGBA) {
    this.#mainColor = val
    if (this.context.pickingArea) {
      this.context.pickingArea.setState(this.state)
    }
    if (this.context.mainColorBar) {
      this.context.mainColorBar.setState(this.state)
    }
  }

  get currentColor (): RGBA {
    return this.#currentColor
  }

  set currentColor (val: RGBA) {
    this.#currentColor = val

    if (this.context.pickingArea) {
      this.context.pickingArea.setState(this.state, true)
    }
    if (this.context.operationsArea) {
      this.context.operationsArea.setState(this.state)
    }
  }

  get alpha (): number {
    return this.#alpha
  }

  set alpha (val: number) {
    this.#alpha = Math.max(0, Math.min(255, val))

    this.currentColor = [this.currentColor[0], this.currentColor[1], this.currentColor[2], val]

    if (this.context.alphaBar) {
      this.context.alphaBar.setState(this.state)
    }
  }

  get state (): ColorPickerState {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    return new Proxy({
      initialValue: this.initialValue,
      mainColor: this.mainColor,
      currentColor: this.currentColor,
      alpha: this.alpha,
      setCurrentFlag: true
    }, {
      get (target, val) {
        return Reflect.get(target, val)
      },

      set (target, key, value) {
        switch (key) {
          case 'initialValue':
          case 'mainColor':
          case 'currentColor':
          case 'alpha':
            _this[key] = value
            break
          case 'setCurrentFlag':
            _this.mainColor = _this.#calculateMainColor(_this.state.currentColor)
            break
        }

        return Reflect.set(target, key, value)
      }
    })
  }

  setValue (value: string): void {
    if (value.startsWith('#')) {
      let val = value.slice(1)
      if (![3, 6, 8].includes(val.length)) {
        // eslint-disable-next-line no-console
        console.error(`'value' expects a hexadecimal color or an rgb color, but got '${value}'`)
        return
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
        this.initialValue = match.slice(1).map(v => hex2number(v)) as RGBA
      }
    } else if (/^rgb/i.test(value)) {
      const match = value.match(/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),*\s*(\d{1,3})*\)/)

      if (match) {
        this.initialValue = match.slice(1).map(v => !v ? 255 : Math.min(255, Math.max(0, Number(v)))) as RGBA
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(`'value' expects a hexadecimal color or an rgb color, but got '${value}'`)
    }
  }

  render (parentElement: HTMLElement): void {
    const el = createElement('div', {
      class: 'color_picks__custom_picker__container'
    })

    const pickingArea = new PickingArea()

    pickingArea.setState(this.state)
    pickingArea.render(el)

    const mainColorBar = new MainColorBar()

    mainColorBar.setState(this.state)
    mainColorBar.render(el)

    const alphaBar = new AlphaBar()

    alphaBar.setState(this.state)
    alphaBar.render(el)

    const operationsArea = new OperationsArea()
    operationsArea.setState(this.state)
    operationsArea.render(el)

    parentElement.appendChild(el)

    this.context.pickingArea = pickingArea
    this.context.mainColorBar = mainColorBar
    this.context.alphaBar = alphaBar
    this.context.operationsArea = operationsArea
    this.context.el = el

    this.el = el
  }

  #calculateMainColor (val: RGBA): RGBA {
    // 计算 mainColor 值
    const mainColor: RGBA = [0, 0, 0, 255]
    // 1. 取索引进行排序
    const sortKeys = Object.keys(val.slice(0, 3)).map(Number).sort((a, b) => val[b]! - val[a]!)

    if (sortKeys[0] === sortKeys[1]) {
      mainColor[sortKeys.shift()!] = 255
      mainColor[sortKeys.shift()!] = 255
      mainColor[sortKeys.shift()!] = 0

      return mainColor
    }

    // 2. 计算最大值所在位置的比例
    const scaleMax = val[sortKeys[0]]! / 255
    // 3. 计算 y 轴值
    const minY = Math.round(val[sortKeys[2]]! * scaleMax)
    const middleY = Math.round(val[sortKeys[1]]! * scaleMax)

    const isSame = val[sortKeys[1]] === val[sortKeys[0]]

    mainColor[sortKeys.shift()!] = 255
    mainColor[sortKeys.shift()!] = isSame ? 255 : Math.round(middleY * (1 - minY / 255))
    mainColor[sortKeys.shift()!] = 0

    return mainColor
  }
}
