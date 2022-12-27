import { describe, it, expect } from 'vitest'
import { OperationArea } from './helper'
import type { ColorPicksState } from '../index'

describe('Test PickingArea', () => {
  const oApp = document.createElement('div')
  const operationArea = new OperationArea()

  const state: ColorPicksState = {
    currentColor: [255, 0, 255, 153],
    mainColor: [255, 0, 0, 255],
    initialValue: [255, 255, 255, 255],
    setCurrentFlag: false,
    panel: 'ColorPicker',
    isPicking: false,
    confirm: () => {},
    cancel: () => {}
  }
  operationArea.setState(state)

  operationArea.render(oApp)

  it('Should have the correct DOM structure', () => {
    expect(oApp.querySelector('.operations__area')).toBeTruthy()
  })

  it('setState should work', () => {
    const oOperationArea = oApp.querySelector<HTMLElement>('.operations__area')!
    const oRInput = oOperationArea.querySelector<HTMLInputElement>('.rgba-input__input-r')!
    const oGInput = oOperationArea.querySelector<HTMLInputElement>('.rgba-input__input-g')!
    const oBInput = oOperationArea.querySelector<HTMLInputElement>('.rgba-input__input-b')!
    const oAInput = oOperationArea.querySelector<HTMLInputElement>('.rgba-input__input-a')!
    const oHexInput = oOperationArea.querySelector<HTMLInputElement>('.hex-input__input')!
    const oPreview = oOperationArea.querySelector<HTMLDivElement>('.hex-input__preview')!

    expect(oRInput.value).toBe('255')
    expect(oGInput.value).toBe('0')
    expect(oBInput.value).toBe('255')
    expect(oAInput.value).toBe('153')
    expect(oHexInput.value).toBe('ff00ff99')
    expect(oPreview.getAttribute('style')).toBe('--background: #ff00ff99;')
  })
})
