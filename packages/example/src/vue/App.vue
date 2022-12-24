<template>
  <div>
    <VueColorPicks
      v-model="color"
    >
      <button>Vue 选择字体颜色</button>
    </VueColorPicks>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import VueColorPicks from 'vue-color-picks'

const color = ref('#ffffff')

watchEffect(() => {
  const oTarget = document.querySelector<HTMLElement>('.target')

  if (oTarget) {
    oTarget.style.color = color.value
  }
})
</script>
