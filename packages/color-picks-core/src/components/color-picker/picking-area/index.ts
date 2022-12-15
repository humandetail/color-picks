/**
 * 取色区
 */

import { sizeConfig } from '../../../config'
import { createElement, getPagePos } from '../../../libs/dom'
import { getColorString } from '../../../libs/helper'
import { ColorPicksState } from '../../../main'

// left: 1 - cMin / cMax
// top: (mMax - cMax) / mMax
// cMid: (mMax - (mMax - mMid) * left) * (1 - top)

export default class PickingArea {
  el: HTMLElement | null = null
  width: number
  height: number

  canvas: HTMLCanvasElement | null = null

  state: ColorPicksState | null = null

  #indicator: HTMLElement | null = null

  #elRect: DOMRect | null = null

  constructor () {
    const [width, height] = sizeConfig.pickingAreaSize

    this.width = width
    this.height = height
  }

  /**
   * @param state - state
   * @param setCurrent - 是否设置当前颜色
   * @param isMainColorChanged - 是否主色条发生改变
   */
  setState (state: ColorPicksState, setCurrent = false, isMainColorChanged = false): void {
    if (isMainColorChanged) {
      // 先赋值，防止死循环
      this.state = state
      // 计算 left 值
      const cMin = Math.min(...state.currentColor.slice(0, 3) as number[])
      const cMax = Math.max(...state.currentColor.slice(0, 3) as number[])
      const mMax = Math.max(...state.mainColor.slice(0, 3) as number[])

      // left: 1 - cMin / cMax
      // top: (mMax - cMax) / mMax
      const left = cMax === 0 ? 0 : Math.max(0, Math.min(1, 1 - cMin / cMax))
      const top = mMax === 0 ? 0 : Math.max(0, Math.min(1, (mMax - cMax) / mMax))

      this.#setIndicatorPosition({
        left,
        top
      }, setCurrent)
    }
    this.state = state
    this.#draw()
  }

  render (parentElement: HTMLElement): void {
    this.#createEl()
    if (!this.el) {
      throw new Error('Create picking area failed.')
    }
    this.#createMainColorBar(this.el)
    this.#createIndicator(this.el)

    parentElement.appendChild(this.el)

    this.#initEvent()
  }

  #initEvent (): void {
    if (this.el) {
      this.el.addEventListener('mousedown', this.#handleMousedown.bind(this), false)
    }
  }

  /**
  * @param percentage - [0,1]
  */
  #setIndicatorPosition ({ left, top }: { left: number, top: number }, setCurrent = true): void {
    if (!this.#indicator) return

    this.#indicator.style.left = `${100 * Math.min(1, Math.max(0, left))}%`
    this.#indicator.style.top = `${100 * Math.min(1, Math.max(0, top))}%`

    if (left < 0.5 && top < 0.5) {
      this.#indicator.style.borderColor = '#333'
    } else {
      this.#indicator.style.borderColor = '#fff'
    }

    if (!setCurrent) {
      return
    }

    const mainColor = this.state!.mainColor

    const sortKeys = Object.keys(mainColor.slice(0, 3)).map(Number).sort((a, b) => mainColor[b]! - mainColor[a]!)

    // left: 1 - cMin / cMax
    // top: (mMax - cMax) / mMax
    // cMid: (mMax - (mMax - mMid) * left) * (1 - top)

    const currentColor = [...mainColor]

    const mMax = mainColor[sortKeys[0]]!
    const mMid = mainColor[sortKeys[1]]!

    currentColor[sortKeys[0]] = Math.max(0, Math.min(255, Math.round(mMax - mMax * top)))
    currentColor[sortKeys[1]] = Math.max(0, Math.min(255, Math.round((mMax - (mMax - mMid) * left) * (1 - top))))
    currentColor[sortKeys[2]] = Math.max(0, Math.min(255, Math.round((mMax - mMax * top) * (1 - left))))

    if (this.state) {
      // this.state.currentColor = [currentColor[0]!, currentColor[1]!, currentColor[2]!, this.state.alpha]
      this.state.currentColor = [currentColor[0]!, currentColor[1]!, currentColor[2]!, this.state.currentColor.at(-1) ?? 255]
    }
  }

  #handleMousedown = (e: MouseEvent): void => {
    if (!this.el) {
      return
    }

    this.#elRect = this.el.getBoundingClientRect()
    this.#handleMousEvent(e)

    window.addEventListener('mousemove', this.#handleMousemove, false)
    window.addEventListener('mouseup', this.#handleMouseup, false)
  }

  #handleMousemove = (e: MouseEvent): void => {
    this.#handleMousEvent(e)
  }

  #handleMouseup = (e: MouseEvent): void => {
    this.#handleMousEvent(e)

    window.removeEventListener('mousemove', this.#handleMousemove, false)
    window.removeEventListener('mouseup', this.#handleMouseup, false)
  }

  #handleMousEvent = (e: MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    const {
      x,
      y
    } = getPagePos(e)

    const {
      left,
      top,
      width,
      height
    } = this.#elRect!

    this.#setIndicatorPosition({
      left: Math.max(0, Math.min(1, (x - left) / width)),
      top: Math.max(0, Math.min(1, (y - top) / height))
    })
  }

  #createEl (): void {
    const { width, height } = this

    this.el = createElement('div', {
      class: 'picking-area__wrapper',
      style: `--width: ${width}px; --height: ${height}px;`
    })
  }

  #createMainColorBar (parentElement: HTMLElement): void {
    const { width, height } = this
    const canvas = createElement('canvas', {
      class: 'picking-area__area',
      width,
      height
    })

    this.canvas = canvas

    parentElement.appendChild(canvas)

    this.#draw()
  }

  #createIndicator (parentElement: HTMLElement): void {
    const indicator = createElement('div', {
      class: 'picking-area__indicator'
    })

    parentElement.appendChild(indicator)
    this.#indicator = indicator
  }

  #draw (): void {
    const canvas = this.canvas

    if (!canvas) return

    const { width, height } = this
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = getColorString(this.state!.mainColor)
    ctx.fillRect(0, 0, width, height)

    // 白色遮罩
    const maskGradientWhite = ctx.createLinearGradient(0, 0, width, 0)
    maskGradientWhite.addColorStop(0, getColorString([255, 255, 255, 255], 'RGBA'))
    maskGradientWhite.addColorStop(1, getColorString([255, 255, 255, 0], 'RGBA'))

    ctx.fillStyle = maskGradientWhite
    ctx.fillRect(0, 0, width, height)

    // 黑色遮罩
    const maskGradientBlack = ctx.createLinearGradient(0, 0, 0, height)
    maskGradientBlack.addColorStop(0, getColorString([0, 0, 0, 0], 'RGBA'))
    maskGradientBlack.addColorStop(1, getColorString([0, 0, 0, 255], 'RGBA'))

    ctx.fillStyle = maskGradientBlack
    ctx.fillRect(0, 0, width, height)
  }

  /**
   * 获取当前通道的值
   * @param percentage - 比例
   * @param max - 最大值
   * @param min - 最小值
   */
  static getChannelValue (percentage: number, max: number, min: number): number {
    return Math.min(max, Math.max(min, max - Math.round((max - min) * percentage)))
  }

  static getMinimum (percentage: number, val: number): number {
    return Math.min(val, Math.max(0, val - Math.round(val * percentage)))
  }
}
