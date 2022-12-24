# vue-color-picks

color-picks for vue.

## Install

Install with npm:

```bash
npm i vue-color-picks
```

Install with yarn:

```bash
yarn add vue-color-picks
```

Install with pnpm:

```bash
pnpm add vue-color-picks
```

## Usage

```vue
<script setup lang="ts">
import VueColorPicks from 'vue-color-picks'
import { ref } from 'vue'

const color = ref('')
</script>

<template>
  <div>
    <div :style="{
      margin: '10px',
      background: color
    }">PREVIEW</div>

    <VueColorPicks
      v-model="color"
      theme="dark"
      outputType="HEX"
    >
      trigger
    </VueColorPicks>
  </div>
</template>

```
