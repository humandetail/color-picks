<script lang="ts" setup>
import { ref, onMounted, onScopeDispose } from 'vue'
import ColorPicks, { ColorPicksOptions } from 'color-picks'

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'outside-click', value: string): void
  (event: 'confirm', value: string): void
  (event: 'cancel'): void
}>()

const props = defineProps<{
  modelValue: string
  outputType?: ColorPicksOptions['outputType']
  theme?: ColorPicksOptions['theme']
}>()

const picksRef = ref<HTMLElement>()

const instanceRef = ref<InstanceType<typeof ColorPicks>>()

function onConfirm (color: string): void {
  emits('update:modelValue', color)
}

function onCancel (): void {
  emits('cancel')
}

function initialPicks (): void {
  instanceRef.value = new ColorPicks(picksRef.value!, {
    outputType: props.outputType ?? 'HEX',
    theme: props.theme ?? 'dark'
  })

  instanceRef.value.on('cancel', onCancel)
  instanceRef.value.on('confirm', onConfirm)
}

function destroyPicks (): void {
  if (!instanceRef.value) return

  instanceRef.value.clear()

  instanceRef.value = undefined!
}

onMounted(() => {
  initialPicks()
})

onScopeDispose(() => {
  destroyPicks()
})

</script>

<template>
  <div ref="picksRef"><slot /></div>
</template>

<style src="color-picks/index.css" />
