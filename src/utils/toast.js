/**
 * 极简 Toast（不引第三方 UI 库）
 * 用法：
 *   import { toast } from '@/utils/toast'
 *   toast.success('Ditambahkan ke keranjang')
 */
import { reactive, readonly } from 'vue'

let seed = 0

const state = reactive({ list: [] })

function push(message, type = 'success', duration = 2200) {
  const id = ++seed
  state.list.push({ id, message, type })
  window.setTimeout(() => dismiss(id), duration)
  return id
}

function dismiss(id) {
  const i = state.list.findIndex((t) => t.id === id)
  if (i > -1) state.list.splice(i, 1)
}

export const toasts = readonly(state)

export const toast = {
  success: (msg, duration) => push(msg, 'success', duration),
  error: (msg, duration) => push(msg, 'error', duration),
  info: (msg, duration) => push(msg, 'info', duration),
  dismiss
}
