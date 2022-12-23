<script lang="ts" setup>
import { ref, onMounted, onScopeDispose } from 'vue'
import ColorPicks from 'color-picks'

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'outside-click', value: string): void
  (event: 'confirm', value: string): void
  (event: 'cancel'): void
}>()

defineProps<{
  modelValue: string
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
  instanceRef.value = new ColorPicks(picksRef.value!)

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
