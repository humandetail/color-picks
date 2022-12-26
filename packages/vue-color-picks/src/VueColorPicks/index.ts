import type { App } from 'vue'
import ColorPicks from './VueColorPicks.vue'

ColorPicks.install = function (Vue: App) {
  Vue.component('color-picks', ColorPicks)
}

export default ColorPicks
