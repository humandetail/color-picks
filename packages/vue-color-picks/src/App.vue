<script setup lang="ts">
import VueColorPicks from './VueColorPicks/index'
import { ref } from 'vue'

const backgroundColor = ref('')

function onChange (_color: string): void {
  console.log('🎏 7: _color', _color)
}
</script>

<template>
  <div>
    <div :style="{backgroundColor}">
      <span style="filter:grayscale(1) contrast(999) invert(1);">PREVIEW</span>
    </div>

    <VueColorPicks v-model="backgroundColor" @change="onChange">
      trigger
    </VueColorPicks>
  </div>
</template>
