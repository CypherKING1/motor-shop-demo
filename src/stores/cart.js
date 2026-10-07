import { defineStore } from 'pinia'
import { getProductById } from '@/data/products'

const STORAGE_KEY = 'vim_motor_cart_v1'

/**
 * 读取 localStorage 缓存（刷新后购物车不丢）
 * 会做一次数据校验：商品已下线 / 数量非法时自动剔除，避免脏数据
 */
function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item && getProductById(item.id) && Number(item.qty) > 0)
      .map((item) => ({
        id: Number(item.id),
        qty: Math.min(Math.max(parseInt(item.qty, 10) || 1, 1), 99)
      }))
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadFromStorage(), // [{ id, qty }]  只存 id + 数量，商品信息实时从 products.js 取
    lastAddedId: null
  }),

  getters: {
    /** 明细：把 id 展开成完整商品对象 + 小计 */
    details(state) {
      return state.items
        .map((item) => {
          const product = getProductById(item.id)
          if (!product) return null
          return {
            ...product,
            qty: item.qty,
            subtotal: product.price * item.qty
          }
        })
        .filter(Boolean)
    },

    /** 商品种类数 */
    lineCount(state) {
      return state.items.length
    },

    /** 购物车总件数（导航栏角标） */
    totalQty(state) {
      return state.items.reduce((sum, item) => sum + item.qty, 0)
    },

    /**
     * 商品合计（不含运费）
     * 注意：getter 里要用 this 访问其它 getter，必须写成普通方法，不能写箭头函数
     */
    subtotal() {
      return this.details.reduce((sum, item) => sum + item.subtotal, 0)
    },

    /** 原价合计，用于展示「你省下了多少」 */
    originalSubtotal() {
      return this.details.reduce(
        (sum, item) => sum + (item.oldPrice > 0 ? item.oldPrice : item.price) * item.qty,
        0
      )
    },

    /** 总节省金额 */
    totalSaving() {
      return Math.max(this.originalSubtotal - this.subtotal, 0)
    },

    isEmpty(state) {
      return state.items.length === 0
    },

    /** 某商品在购物车里的数量 */
    qtyOf(state) {
      return (id) => state.items.find((item) => item.id === Number(id))?.qty || 0
    }
  },

  actions: {
    /** 写入 localStorage */
    persist() {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      } catch {
        /* 隐私模式下 localStorage 可能不可用，忽略即可 */
      }
    },

    /** 加入购物车：已存在则累加数量 */
    add(productOrId, qty = 1) {
      const id = typeof productOrId === 'object' ? productOrId?.id : productOrId
      const product = getProductById(id)
      if (!product) return false

      const amount = Math.max(parseInt(qty, 10) || 1, 1)
      const existing = this.items.find((item) => item.id === product.id)

      if (existing) {
        existing.qty = Math.min(existing.qty + amount, 99)
      } else {
        this.items.push({ id: product.id, qty: Math.min(amount, 99) })
      }

      this.lastAddedId = product.id
      this.persist()
      return true
    },

    /** 直接设置数量；数量 <= 0 时等同于删除（结算页的减号行为） */
    setQty(id, qty) {
      const numId = Number(id)
      const target = this.items.find((item) => item.id === numId)
      if (!target) return

      const next = parseInt(qty, 10)
      if (!Number.isFinite(next) || next <= 0) {
        this.remove(numId)
        return
      }
      target.qty = Math.min(next, 99)
      this.persist()
    },

    increase(id) {
      const target = this.items.find((item) => item.id === Number(id))
      if (!target) return
      this.setQty(id, target.qty + 1)
    },

    decrease(id) {
      const target = this.items.find((item) => item.id === Number(id))
      if (!target) return
      if (target.qty <= 1) {
        this.remove(id)
        return
      }
      this.setQty(id, target.qty - 1)
    },

    remove(id) {
      const numId = Number(id)
      this.items = this.items.filter((item) => item.id !== numId)
      this.persist()
    },

    clear() {
      this.items = []
      this.lastAddedId = null
      this.persist()
    },

    /** 清空缓存（调试用） */
    reset() {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
      this.items = []
      this.lastAddedId = null
    }
  }
})
