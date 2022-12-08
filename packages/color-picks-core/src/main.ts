import MainColorBar from './components/color-picker/main-color-bar'
import AlphaBar from './components/color-picker/alpha-bar'

import './assets/styles/index.scss'
import { createElement } from './libs/dom'

const mainColorBar = new MainColorBar()
const alphaBar = new AlphaBar([0, 0, 0, 0])

const oCustomPicker = createElement('div', {
  class: 'color_picks__custom_picker__container'
})

document.querySelector('#app')!.appendChild(oCustomPicker)

mainColorBar.render(oCustomPicker)
alphaBar.render(oCustomPicker)
