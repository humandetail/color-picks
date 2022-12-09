/**
 * 取色区
 */

import { sizeConfig } from '../../../config'
import { createElement, getPagePos } from '../../../libs/dom'
import { getColorString } from '../../../libs/helper'
import { RGBA } from '../../../types'

export default class PickingArea {
  el: HTMLElement | null = null
  width: number
  height: number

  mainColor: RGBA
  currentColor: RGBA

  #indicator: HTMLElement | null = null

  #elRect: DOMRect | null = null

  constructor (options: {
    mainColor: RGBA
    currentColor: RGBA
  }) {
    const [width, height] = sizeConfig.pickingAreaSize

    this.width = width
    this.height = height

    this.mainColor = options.mainColor
    this.currentColor = options.currentColor
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
  #setIndicatorPosition ({ left, top }: { left: number, top: number }): void {
    if (!this.#indicator) return

    this.#indicator.style.left = `${100 * Math.min(1, Math.max(0, left))}%`
    this.#indicator.style.top = `${100 * Math.min(1, Math.max(0, top))}%`

    if (left < 0.5 && top < 0.5) {
      this.#indicator.style.borderColor = '#333'
    } else {
      this.#indicator.style.borderColor = '#fff'
    }

    let [r, g, b] = this.mainColor

    const max = PickingArea.getMinimum(top, 255)

    r = PickingArea.getChannelValue(left, max, PickingArea.getMinimum(top, r))
    g = PickingArea.getChannelValue(left, max, PickingArea.getMinimum(top, g))
    b = PickingArea.getChannelValue(left, max, PickingArea.getMinimum(top, b))

    console.log(r, g, b)
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
      left: (x - left) / width,
      top: (y - top) / height
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

    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = getColorString(this.mainColor)
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

    parentElement.appendChild(canvas)
  }

  #createIndicator (parentElement: HTMLElement): void {
    const indicator = createElement('div', {
      class: 'picking-area__indicator'
    })

    parentElement.appendChild(indicator)
    this.#indicator = indicator
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
