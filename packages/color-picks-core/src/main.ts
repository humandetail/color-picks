import MainColorBar from './components/color-picker/main-color-bar'
import AlphaBar from './components/color-picker/alpha-bar'
import PickingArea from './components/color-picker/picking-area'

import './assets/styles/index.scss'
import { createElement } from './libs/dom'

const mainColorBar = new MainColorBar()
const alphaBar = new AlphaBar([0, 0, 0, 0])
const pickingArea = new PickingArea({
  mainColor: [30, 0, 255, 0],
  currentColor: [255, 255, 255, 255]
})

const oCustomPicker = createElement('div', {
  class: 'color_picks__custom_picker__container'
})

document.querySelector('#app')!.appendChild(oCustomPicker)

pickingArea.render(oCustomPicker)
mainColorBar.render(oCustomPicker)
alphaBar.render(oCustomPicker)
