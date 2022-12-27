// @ts-nocheck
import { Window } from 'happy-dom'
import { mockCanvas } from './mockCanvas'

const window = new Window()
mockCanvas(window)
// @ts-expect-error
globalThis.window = window
// @ts-expect-error
globalThis.document = window.document

export { default as ColorPicker } from '../../components/color-picker'
export { default as PickingArea } from '../../components/color-picker/picking-area'
export { default as AlphaBar } from '../../components/color-picker/alpha-bar'
export { default as MainColorBar } from '../../components/color-picker/main-color-bar'
export { default as OperationArea } from '../../components/color-picker/operations-area'
