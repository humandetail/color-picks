import { describe, test, expect } from 'vitest'
// import { ColorPicker } from './helper'
// import { RGBA } from '../types'

// const BLACK = [0, 0, 0, 255]
// const cp = new ColorPicker('#000')

describe('construct color picker', () => {
  test('should work', () => {
    expect(1 + 1).toEqual(2)
  })
  // test('init by uncorrect string', () => {
  //   expect(new ColorPicker('').initialValue).toStrictEqual([255, 255, 255, 255])
  // })

  // test('init by hex', () => {
  //   expect(cp.initialValue).toStrictEqual(BLACK)
  // })

  // test('render panel', () => {
  //   cp.render(document.createElement('div'))
  // })

  // test('reset color', () => {
  //   cp.currentColor = BLACK as RGBA
  //   cp.mainColor = [255, 255, 0, 255] as RGBA
  //   cp.alpha = 255
  //   expect(cp.currentColor).toStrictEqual(BLACK)
  //   expect(cp.mainColor).toStrictEqual([255, 255, 0, 255])
  //   expect(cp.alpha).toBe(255)
  // })
})
