import { Window } from 'happy-dom'
import { mockCanvas } from './mockCanvas'

const window = new Window()
mockCanvas(window)
// @ts-expect-error
globalThis.window = window
// @ts-expect-error
globalThis.document = window.document

export { default as ColorPicker } from '../../components/color-picker'
export { default as AlphaBar } from '../../components/color-picker'
