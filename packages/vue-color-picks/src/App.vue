<script setup lang="ts">
import VueColorPicks from './VueColorPicks.vue'
import { ref } from 'vue'

const color = ref('')
</script>

<template>
  <div>
    <div :style="{
      margin: '10px',
      background: color
    }">PREVIEW</div>

    <VueColorPicks v-model="color">
      trigger
    </VueColorPicks>
  </div>
</template>
