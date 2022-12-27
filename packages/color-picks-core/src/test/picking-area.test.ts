import { describe, it, expect } from 'vitest'
import { PickingArea } from './helper'
import type { ColorPicksState } from '../index'

describe('Test PickingArea', () => {
  const oApp = document.createElement('div')
  const pickingArea = new PickingArea()

  const state: ColorPicksState = {
    currentColor: [255, 255, 255, 153],
    mainColor: [255, 0, 0, 255],
    initialValue: [255, 255, 255, 255],
    setCurrentFlag: false,
    panel: 'ColorPicker',
    isPicking: false,
    confirm: () => {},
    cancel: () => {}
  }
  pickingArea.setState(state)

  pickingArea.render(oApp)

  it('Should have the correct DOM structure', () => {
    expect(oApp.querySelector('.picking-area__wrapper')).toBeTruthy()
  })

  it('setState should work', () => {
    const oIndicator = pickingArea.el?.querySelector<HTMLElement>('.picking-area__indicator')

    expect(oIndicator?.style?.left).toBe('')
    expect(oIndicator?.style?.top).toBe('')

    state.currentColor = [255, 0, 0, 255]
    pickingArea.setState(state, true, true)
    expect(oIndicator?.style?.left).toBe('100%')
    expect(oIndicator?.style?.top).toBe('0%')

    state.mainColor = [255, 255, 0, 255]
    pickingArea.setState(state, true, true)
    expect(state.currentColor).toEqual([255, 255, 0, 255])
  })
})
