/**
 * 透明取值条
 */

import { ColorPickerState } from '..'
import { sizeConfig } from '../../../config'
import { createElement, getPagePos } from '../../../libs/dom'
import { getColorString } from '../../../libs/helper'

export default class AlphaBar {
  el: HTMLElement | null = null
  width: number
  height: number

  state: ColorPickerState | null = null

  #indicator: HTMLElement | null = null

  #elRect: DOMRect | null = null

  constructor () {
    const [width, height] = sizeConfig.alphaBarSize

    this.width = width
    this.height = height
  }

  render (parentElement: HTMLElement): void {
    this.#createEl()
    if (!this.el) {
      throw new Error('Create alpha bar failed.')
    }
    this.#createMainColorBar(this.el)
    this.#createIndicator(this.el)

    parentElement.appendChild(this.el)

    this.#initEvent()
  }

  setState (state: ColorPickerState): void {
    this.state = state
    this.#setIndicatorPosition(state.alpha / 255)
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

    this.#indicator.style.left = `${100 * Math.min(1, Math.max(0, percentage))}%`
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

    const clientX = getPagePos(e).x

    const rect = this.#elRect

    if (this.state) {
      const percentage = (clientX - rect!.left) / rect!.width
      this.state.alpha = Math.round(255 * Math.min(1, Math.max(0, percentage)))
    }

    // this.#setIndicatorPosition((clientX - rect!.left) / rect!.width)
  }

  #createEl (): void {
    const { width, height } = this

    this.el = createElement('div', {
      class: 'alpha-bar__wrapper',
      style: `--width: ${width}px; --height: ${height}px;`
    })
  }

  #createMainColorBar (parentElement: HTMLElement): void {
    const { width, height } = this
    const canvas = createElement('canvas', {
      class: 'alpha-bar__bar',
      width,
      height
    })

    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    const [r, g, b] = this.state!.mainColor
    gradient.addColorStop(0, getColorString([r, g, b, 0], 'RGBA'))
    gradient.addColorStop(1, getColorString([r, g, b, 255], 'RGBA'))

    ctx.fillStyle = gradient

    ctx.fillRect(0, 0, width, height)

    parentElement.appendChild(canvas)
  }

  #createIndicator (parentElement: HTMLElement): void {
    const indicator = createElement('div', {
      class: 'alpha-bar__indicator'
    })

    parentElement.appendChild(indicator)
    this.#indicator = indicator

    this.#setIndicatorPosition((this.state?.alpha ?? 255) / 255)
  }
}
