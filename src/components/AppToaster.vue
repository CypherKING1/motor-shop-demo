<script setup>
import { toasts } from '@/utils/toast'

const icons = {
  success: '✓',
  error: '!',
  info: 'i'
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-wrap">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts.list"
          :key="t.id"
          class="toast"
          :class="t.type === 'error' ? 'toast-error' : ''"
        >
          <span class="toast-icon">{{ icons[t.type] || '✓' }}</span>
          <span>{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
}
</style>
