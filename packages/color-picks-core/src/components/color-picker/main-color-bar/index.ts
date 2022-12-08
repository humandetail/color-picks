/**
 * 取色器主色条
 */

import { PREFIX, sizeConfig } from '../../../config'
import { createElement, getPagePos } from '../../../libs/dom'
import { getColorString } from '../../../libs/helper'
import { RGBA } from '../../../types'

export default class MainColorBar {
  el: HTMLElement | null = null
  width: number
  height: number

  #indicator: HTMLElement | null = null

  #colors: RGBA[] = []

  #elRect: DOMRect | null = null

  constructor () {
    const [width, height] = sizeConfig.mainColorBarSize

    this.width = width
    this.height = height
    this.init()
  }

  init (): void {
    this.#createColors()
    console.log(this.#colors)
  }

  render (parentElement: HTMLElement): void {
    this.#createEl()
    if (!this.el) {
      throw new Error('Create main color bar failed.')
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
  #setIndicatorPosition (percentage: number): void {
    if (!this.#indicator) return

    const { width, height } = this

    this.#indicator.style.transform = `translateX(${(width - height) * Math.min(1, Math.max(0, percentage))}px)`
    console.log(Math.round(this.#colors.length * percentage), this.#colors[Math.round(this.#colors.length * percentage)])
    this.#indicator.style.backgroundColor = getColorString(this.#colors[Math.round(this.#colors.length * percentage)])
  }

  #handleMousedown = (e: MouseEvent): void => {
    if (!this.el) {
      return
    }

    this.#elRect = this.el.getBoundingClientRect()
    this.#handleMousEvent(e)
    // this.#elRect = rect
    // this.#startX = getPagePos(e).x

    // console.log(this.#elRect, this.#startX)
    // this.#setIndicatorPosition(100 * (this.#startX - rect.left) / rect.width)

    document.addEventListener('mousemove', this.#handleMousemove, false)
    document.addEventListener('mouseup', this.#handleMouseup, false)
  }

  #handleMousemove = (e: MouseEvent): void => {
    this.#handleMousEvent(e)
  }

  #handleMouseup = (e: MouseEvent): void => {
    this.#handleMousEvent(e)

    document.removeEventListener('mousemove', this.#handleMousemove, false)
    document.removeEventListener('mouseup', this.#handleMouseup, false)
  }

  #handleMousEvent = (e: MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    const clientX = getPagePos(e).x

    const rect = this.#elRect

    this.#setIndicatorPosition((clientX - rect!.left) / rect!.width)
  }

  #createEl (): void {
    const { width, height } = this

    this.el = createElement('div', {
      class: `${PREFIX}main-color-bar__wrapper`,
      style: `
        position: relative;
        width: ${width}px;
        height: ${height}px;
      `
    })
  }

  #createMainColorBar (parentElement: HTMLElement): void {
    const { width, height } = this
    const canvas = createElement('canvas', {
      class: `${PREFIX}main-color-bar__bar`,
      width,
      height,
      style: 'display: block; border-radius: 2px;'
    })

    const ctx = canvas.getContext('2d')!

    const length = this.#colors.length

    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    for (let i = 0; i <= 6; i++) {
      gradient.addColorStop(i / 6, getColorString(i === 6 ? this.#colors[0] : this.#colors[length * i / 6]))
    }
    // gradient.addColorStop(0, getColorString(this.#colors[0]))
    // gradient.addColorStop(1 / 6, getColorString([255, 0, 255]))
    // gradient.addColorStop(2 / 6, getColorString([0, 0, 255]))
    // gradient.addColorStop(3 / 6, getColorString([0, 255, 255]))
    // gradient.addColorStop(4 / 6, getColorString([0, 255, 0]))
    // gradient.addColorStop(5 / 6, getColorString([255, 255, 0]))
    // gradient.addColorStop(1, getColorString(this.#colors[length - 1]))

    ctx.fillStyle = gradient

    ctx.fillRect(0, 0, width, height)

    parentElement.appendChild(canvas)
  }

  #createIndicator (parentElement: HTMLElement): void {
    const indicator = createElement('div', {
      class: `${PREFIX}main-color-bar__indicator`,
      style: `
        position: absolute;
        left: 0;
        top: 0;
        width: ${sizeConfig.mainColorBarSize[1]}px;
        height: ${sizeConfig.mainColorBarSize[1]}px;
        border: 2px solid #fff;
        outline: 1px solid #ccc;
        padding: 2px;
        border-radius: 50%;
        box-sizing: border-box;
        background-color: ${getColorString(this.#colors[0])}
      `
    })

    parentElement.appendChild(indicator)
    this.#indicator = indicator
  }

  #createColors (): void {
    let r: number = 255
    let g: number = 0
    let b: number = 0

    const colors: RGBA[] = []

    while (b < 255) {
      colors.push([r, g, b, 100])
      b++
    }
    while (r > 0) {
      colors.push([r, g, b, 100])
      r--
    }
    while (g < 255) {
      colors.push([r, g, b, 100])
      g++
    }
    while (b > 0) {
      colors.push([r, g, b, 100])
      b--
    }
    while (r < 255) {
      colors.push([r, g, b, 100])
      r++
    }
    while (g > 0) {
      colors.push([r, g, b, 100])
      g--
    }

    this.#colors = colors
  }
}
