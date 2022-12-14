import ColorPicker from './components/color-picker'
import PresetPicker from './components/preset-picker'

import './assets/styles/index.scss'

const colorPicker = new ColorPicker()
colorPicker.setValue('rgb(30,   100, 200, 200)')

colorPicker.render(document.querySelector('#app')!)

const presetPicker = new PresetPicker()

presetPicker.render(document.querySelector('#app')!)
