import { describe, it, expect } from 'vitest'

import { ColorPicker } from './helper'

import type { ColorPicksState } from '../index'

describe('Test color picker', () => {
  const oApp = document.createElement('div')
  const state: ColorPicksState = {
    currentColor: [255, 255, 255, 153],
    mainColor: [255, 255, 0, 255],
    initialValue: [255, 255, 255, 255],
    setCurrentFlag: false,
    panel: 'ColorPicker',
    isPicking: false,
    confirm: () => {},
    cancel: () => {}
  }

  const colorPicker = new ColorPicker(state)
  colorPicker.render(oApp)

  it('Should have the correct DOM structure', () => {
    expect(colorPicker.el).toBeTruthy()
    expect(colorPicker.el?.classList?.contains('color_picks__custom_picker__container')).toBeTruthy()

    const context = colorPicker.context

    expect(context.alphaBar?.el).toBeTruthy()
    expect(context.mainColorBar?.el).toBeTruthy()
    expect(context.pickingArea?.el).toBeTruthy()
  })
})
