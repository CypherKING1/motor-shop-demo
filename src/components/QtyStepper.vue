<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
  step: { type: Number, default: 1 }
})

const emit = defineEmits(['update:modelValue', 'change'])

const canDecrease = computed(() => props.modelValue > props.min)
const canIncrease = computed(() => props.modelValue < props.max)

function commit(next) {
  const clamped = Math.min(Math.max(next, props.min), props.max)
  if (clamped === props.modelValue) return
  emit('update:modelValue', clamped)
  emit('change', clamped)
}

function onInput(event) {
  const raw = parseInt(event.target.value, 10)
  if (!Number.isFinite(raw)) {
    event.target.value = props.modelValue
    return
  }
  commit(raw)
}
</script>

<template>
  <div class="stepper">
    <button
      type="button"
      aria-label="Kurangi jumlah"
      :disabled="!canDecrease"
      @click="commit(modelValue - step)"
    >
      −
    </button>
    <input
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      inputmode="numeric"
      aria-label="Jumlah"
      @change="onInput"
      @blur="onInput"
    />
    <button
      type="button"
      aria-label="Tambah jumlah"
      :disabled="!canIncrease"
      @click="commit(modelValue + step)"
    >
      +
    </button>
  </div>
</template>
