import { describe, it, expect } from 'vitest'
import { MainColorBar } from './helper'
import type { ColorPicksState } from '../index'

describe('Test MainColorBar', () => {
  const oApp = document.createElement('div')
  const mainColorBar = new MainColorBar()
  mainColorBar.render(oApp)

  it('Should have the correct DOM structure', () => {
    expect(oApp.querySelector('.main-color-bar__wrapper')).toBeTruthy()
  })

  it('setState Should work', () => {
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
    mainColorBar.setState(state)

    const oIndicator = mainColorBar.el?.querySelector<HTMLElement>('.main-color-bar__indicator')

    expect(oIndicator?.style?.top).toBe('83.33333333333334%')

    state.mainColor = [255, 0, 255, 255]
    mainColorBar.setState(state)
    expect(oIndicator?.style?.top).toBe('16.666666666666664%')
  })
})
