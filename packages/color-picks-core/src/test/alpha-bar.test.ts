import { describe, it, expect } from 'vitest'
import { AlphaBar } from './helper'
import type { ColorPicksState } from '../index'

describe('Test AlphaBar', () => {
  const oApp = document.createElement('div')
  const alphaBar = new AlphaBar()
  alphaBar.render(oApp)

  it('Should have the correct DOM structure', () => {
    expect(oApp.querySelector('.alpha-bar__wrapper')).toBeTruthy()
  })

  it('setState Should work', () => {
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
    alphaBar.setState(state)

    const oIndicator = alphaBar.el?.querySelector<HTMLElement>('.alpha-bar__indicator')

    expect(oIndicator?.style?.left).toBe('60%')

    state.currentColor = [255, 255, 255, 255]
    alphaBar.setState(state)
    expect(oIndicator?.style?.left).toBe('100%')
  })
})
