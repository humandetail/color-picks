/**
 * 取色器主色条
 */

import { sizeConfig } from '../../../config'
import { createElement, getPagePos } from '../../../libs/dom'
import { getColorString } from '../../../libs/helper'
import { ColorPicksState } from '../../..'
import { RGBA } from '../../../types'

export default class MainColorBar {
  el: HTMLElement | null = null
  width: number
  height: number

  state: ColorPicksState | null = null

  #indicator: HTMLElement | null = null

  #colors: RGBA[] = []

  #elRect: DOMRect | null = null

  constructor () {
    const [width, height] = sizeConfig.mainColorBarSize

    this.width = width
    this.height = height
    this.#init()
  }

  #init (): void {
    this.#createColors()
  }

  setState (state: ColorPicksState): void {
    this.state = state
    const idx = this.#colors.findIndex(c => JSON.stringify(state.mainColor) === JSON.stringify(c))
    this.#setIndicatorPosition(idx / this.#colors.length)
  }

  render (parentElement: HTMLElement): void {
    this.#createEl()
    this.#createMainColorBar(this.el!)
    this.#createIndicator(this.el!)

    parentElement.appendChild(this.el!)

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

    percentage = Math.min(1, Math.max(0, percentage))

    this.#indicator.style.top = `${100 * percentage}%`
    // this.#indicator.style.background = `${getColorString()}`
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

    const clientY = getPagePos(e).y

    const rect = this.#elRect

    const percentage = Math.min(1, Math.max(0, (clientY - rect!.top) / rect!.height))

    this.state!.mainColor = this.#colors[Math.round((this.#colors.length - 1) * percentage)]

    // this.#setIndicatorPosition()
  }

  #createEl (): void {
    const { width, height } = this

    this.el = createElement('div', {
      class: 'main-color-bar__wrapper',
      style: `--width: ${width}px; --height: ${height}px;`
    })
  }

  #createMainColorBar (parentElement: HTMLElement): void {
    const { width, height } = this
    const canvas = createElement('canvas', {
      class: 'main-color-bar__bar',
      width,
      height
    })

    const ctx = canvas.getContext('2d')!

    const length = this.#colors.length

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    for (let i = 0; i <= 6; i++) {
      gradient.addColorStop(i / 6, getColorString(i === 6 ? this.#colors[0] : this.#colors[length * i / 6]))
    }

    ctx.fillStyle = gradient

    ctx.fillRect(0, 0, width, height)

    parentElement.appendChild(canvas)
  }

  #createIndicator (parentElement: HTMLElement): void {
    const indicator = createElement('div', {
      class: 'main-color-bar__indicator'
      // style: `background: ${getColorString(this.#colors[0])}`
    })

    parentElement.appendChild(indicator)
    this.#indicator = indicator

    const idx = this.#colors.findIndex(c => JSON.stringify(this.state?.mainColor ?? [255, 0, 0, 255]) === JSON.stringify(c))
    this.#setIndicatorPosition(idx / this.#colors.length)
  }

  #createColors (): void {
    let r: number = 255
    let g: number = 0
    let b: number = 0

    const colors: RGBA[] = []

    while (b < 255) {
      colors.push([r, g, b, 255])
      b++
    }
    while (r > 0) {
      colors.push([r, g, b, 255])
      r--
    }
    while (g < 255) {
      colors.push([r, g, b, 255])
      g++
    }
    while (b > 0) {
      colors.push([r, g, b, 255])
      b--
    }
    while (r < 255) {
      colors.push([r, g, b, 255])
      r++
    }
    while (g > 0) {
      colors.push([r, g, b, 255])
      g--
    }

    this.#colors = colors
  }
}
