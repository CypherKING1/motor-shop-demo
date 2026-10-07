<script setup>
import { watch, onBeforeUnmount } from 'vue'

/**
 * 通用弹窗（不依赖任何 UI 库）
 * <AppDialog v-model="visible" title="…" @confirm="…" @cancel="…">内容</AppDialog>
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  confirmText: { type: String, default: 'OK' },
  cancelText: { type: String, default: '' }, // 传空字符串则不显示取消按钮
  closeOnMask: { type: Boolean, default: true },
  showClose: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function close() {
  emit('update:modelValue', false)
}

function onCancel() {
  emit('cancel')
  close()
}

function onConfirm() {
  emit('confirm')
}

function onMaskClick() {
  if (props.closeOnMask) onCancel()
}

function onKeydown(e) {
  if (e.key === 'Escape') onCancel()
}

watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  }
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-mask" @click.self="onMaskClick">
      <div class="modal" role="dialog" aria-modal="true">
        <div v-if="showClose" class="row-between" style="padding: 12px 14px 0">
          <span></span>
          <button type="button" aria-label="Tutup" @click="onCancel">✕</button>
        </div>

        <div class="modal-head">
          <slot name="icon"></slot>
          <h3 class="modal-title">{{ title }}</h3>
        </div>

        <div class="modal-body">
          <slot></slot>
        </div>

        <div class="modal-foot">
          <button
            v-if="cancelText"
            class="btn btn-ghost"
            type="button"
            @click="onCancel"
          >
            {{ cancelText }}
          </button>
          <button class="btn btn-primary" type="button" @click="onConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
