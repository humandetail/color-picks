import { createElement } from '../../libs/dom'

import PickingArea from './picking-area'
import MainColorBar from './main-color-bar'
import AlphaBar from './alpha-bar'
import OperationsArea from './operations-area'
import { ColorPicksState } from '../..'

export default class ColorPicker {
  el: HTMLDivElement | null = null

  state: ColorPicksState

  context: {
    pickingArea?: PickingArea
    mainColorBar?: MainColorBar
    alphaBar?: AlphaBar
    operationsArea?: OperationsArea
  } = {}

  constructor (state: ColorPicksState) {
    this.state = state
  }

  render (parentElement: HTMLElement): void {
    const el = createElement('div', {
      class: 'color_picks__custom_picker__container'
    }, createElement('h2', {
      class: 'color_picks__custom_picker__header'
    }, '拾色器'))

    const pickingArea = new PickingArea()

    pickingArea.setState(this.state)
    pickingArea.render(el)

    const mainColorBar = new MainColorBar()

    mainColorBar.setState(this.state)
    mainColorBar.render(el)

    const alphaBar = new AlphaBar()

    alphaBar.setState(this.state)
    alphaBar.render(el)

    const operationsArea = new OperationsArea()
    operationsArea.setState(this.state)
    operationsArea.render(el)

    parentElement.appendChild(el)

    this.context.pickingArea = pickingArea
    this.context.mainColorBar = mainColorBar
    this.context.alphaBar = alphaBar
    this.context.operationsArea = operationsArea

    this.el = el
  }
}
