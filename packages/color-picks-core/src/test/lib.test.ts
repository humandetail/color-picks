import { describe, it, expect } from 'vitest'

import {
  number2hex,
  getColorString,
  getCheckedColor,
  hex2rgba
} from '../libs/helper'

import {
  getScrollOffset,
  getPagePos
} from '../libs/dom'

describe('Test helper', () => {
  it('number2hex should work.', () => {
    expect(number2hex(255)).toEqual('ff')
  })

  it('getColorString should work.', () => {
    expect(getColorString([255, 255, 255, 255], 'RGB')).toEqual('rgb(255,255,255)')
    expect(getColorString([255, 255, 255, 255], 'RGBA')).toEqual('rgba(255,255,255,1)')
    expect(getColorString([255, 255, 255, 255], 'HEX')).toEqual('#ffffff')
    expect(getColorString([255, 255, 255, 200], 'HEX')).toEqual('#ffffffc8')
  })

  it('getCheckedColor should work.', () => {
    expect(getCheckedColor([255, 255, 255])).toEqual('#333')
    expect(getCheckedColor([124, 124, 124])).toEqual('#fff')
  })

  it('hex2rgba should work.', () => {
    expect(hex2rgba('#ffffff')).toEqual([255, 255, 255, 255])
    expect(hex2rgba('ffffff')).toEqual([255, 255, 255, 255])
    expect(hex2rgba('ffff')).toEqual([255, 255, 255, 255])
    expect(hex2rgba('fff')).toEqual([255, 255, 255, 255])
  })
})

describe('Test dom', () => {
  it('getScrollOffset should work.', () => {
    expect(getScrollOffset()).toEqual({ left: 0, top: 0 })

    window.pageXOffset = 10
    window.pageYOffset = 10
    expect(getScrollOffset()).toEqual({ left: 10, top: 10 })
  })

  it('getPagePos should work.', () => {
    expect(getPagePos({
      clientX: 0,
      clientY: 0
    } as MouseEvent)).toEqual({ x: 10, y: 10 })
  })
})
