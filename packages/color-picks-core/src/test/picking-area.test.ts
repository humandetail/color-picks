import { describe, test } from 'vitest'
import { ColorPicker } from './helper'

const cp = new ColorPicker()
cp.render(document.createElement('div'))
const pickingArea = cp.context.pickingArea!

describe('test Operations Area events', () => {
  test('all events are settled', () => {
    const el = pickingArea.el!
    const mouseEvent = document.createEvent('MouseEvent')
    mouseEvent.initEvent('mousedown', true, true)
    el.addEventListener('mousedown', () => {})
    el.dispatchEvent(mouseEvent)

    mouseEvent.initEvent('mousemove', true, true)
    window.addEventListener('mousemove', () => {})
    window.dispatchEvent(mouseEvent)

    mouseEvent.initEvent('mouseup', true, true)
    window.addEventListener('mouseup', () => {})
    window.dispatchEvent(mouseEvent)

    el.addEventListener('mouseup', () => {})
    el.dispatchEvent(mouseEvent)
  })
})
