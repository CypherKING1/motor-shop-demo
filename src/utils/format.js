/**
 * 货币与图片小工具
 * 印尼盾（Rupiah）格式：Rp 24.500.000（千分位用「.」）
 */

const idrFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

/** 24500000 -> "Rp 24.500.000" */
export function formatIDR(value) {
  const n = Number(value) || 0
  return `Rp ${idrFormatter.format(n)}`
}

/** 24500000 -> "24.500.000"（只要数字，用于表单/表格） */
export function formatNumber(value) {
  return idrFormatter.format(Number(value) || 0)
}

/**
 * 把 public 目录下的绝对路径拼上部署前缀。
 *
 * 为什么需要：项目可能部署在子路径下（GitHub Pages 是 /<仓库名>/），
 * 而 products.js 里写的是 '/images/motors/xxx.jpg' 这种绝对路径，
 * Vite 不会处理 JS 运行时的字符串，直接输出的话在子路径部署下会 404。
 * 用 import.meta.env.BASE_URL 拼一下，本地（/）和 GitHub Pages（/<repo>/）都正确。
 *
 *   assetUrl('/images/motors/m-500.jpg')
 *   → 本地：/images/motors/m-500.jpg
 *   → Pages：/motor-shop-demo/images/motors/m-500.jpg
 */
export function assetUrl(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path)) return path // 外链原样返回
  const prefix = String(import.meta.env.BASE_URL || '/').replace(/\/+$/, '')
  return `${prefix}/${String(path).replace(/^\/+/, '')}`
}

/** 图片占位（所有商品图加载失败时统一回退到这张 SVG） */
export const PLACEHOLDER_IMAGE = assetUrl('/images/placeholder-motor.svg')

/**
 * img 的 @error 处理器：换成占位图
 * 用法：<img :src="assetUrl(p.image)" @error="handleImageError" />
 *
 * 注意：不能用「标记只回退一次」的写法。轮播图会在运行时更换 src，
 * 换图后再次报错时标记仍是 1，图片就会裂开。这里改用
 * 「当前 src 已经是占位图就不再处理」来判断，既能防死循环，
 * 也能支持 src 多次变化。
 */
export function handleImageError(event) {
  const img = event?.target
  if (!img) return
  const current = img.getAttribute('src') || ''
  if (current === PLACEHOLDER_IMAGE) return
  img.src = PLACEHOLDER_IMAGE
}

/** 生成一个演示用订单号，例如 VIM-20261007-4821 */
export function generateOrderNo() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `VIM-${ymd}-${rand}`
}

/** 折扣百分比，用于「-12%」角标 */
export function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}
