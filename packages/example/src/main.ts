import ColorPicks from 'color-picks'
import './style.css'

import 'color-picks/index.css'

import './react'

const bgColorPicks = new ColorPicks('.btn-bg')

bgColorPicks.on('confirm', color => {
  const oTarget = document.querySelector<HTMLDivElement>('.target')
  if (oTarget) {
    oTarget.style.backgroundColor = color
  }
})

const fontColorPicks = new ColorPicks('.btn-font')

fontColorPicks.on('confirm', color => {
  const oTarget = document.querySelector<HTMLDivElement>('.target')
  if (oTarget) {
    oTarget.style.color = color
  }
})
