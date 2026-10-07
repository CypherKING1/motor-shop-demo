<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { categories, getProductById } from '@/data/products'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const drawerOpen = ref(false)
const keyword = ref('')

/** 正在浏览的商品所属分类（详情页时用来高亮对应分类） */
const currentProductCategory = computed(() => {
  if (route.name !== 'product-detail') return null
  return getProductById(route.params.id)?.category || null
})

/**
 * 导航高亮判断
 *
 * ⚠️ 不能用 vue-router 自动加的 router-link-active / router-link-exact-active：
 * 它只比对 path，而「全部商品 / 摩托 / 自行车 / 双驱」这几个链接**都指向 /katalog**，
 * 只靠 query 区分，结果就是点任意一个，四个链接全部高亮。
 * 必须自己把 query.kategori 也比一遍。
 */
function isNavActive(item) {
  const target = item.to || {}

  if (target.name === 'home') return route.name === 'home'
  if (target.name === 'cart') return route.name === 'cart'
  if (target.name === 'checkout') return route.name === 'checkout'

  if (target.name === 'catalog') {
    const wanted = target.query?.kategori || null
    if (route.name === 'catalog') return (route.query.kategori || null) === wanted
    // 商品详情页：高亮它所属的分类，「全部商品」不高亮
    if (route.name === 'product-detail') return !!wanted && wanted === currentProductCategory.value
    return false
  }

  return route.name === target.name
}

const navItems = [
  { label: 'Beranda', to: { name: 'home' } },
  { label: 'Semua Produk', to: { name: 'catalog' } },
  { label: 'Motor Listrik', to: { name: 'catalog', query: { kategori: 'motor-listrik' } } },
  { label: 'Sepeda Listrik', to: { name: 'catalog', query: { kategori: 'sepeda-listrik' } } },
  { label: 'Sepeda Dual Drive', to: { name: 'catalog', query: { kategori: 'sepeda-dual-drive' } } },
  { label: 'Keranjang', to: { name: 'cart' } }
]

const drawerItems = computed(() => [
  { label: '🏠 Beranda', note: '首页', to: { name: 'home' } },
  { label: '🏍️ Semua Produk', note: '全部商品', to: { name: 'catalog' } },
  ...categories
    .filter((c) => c.id !== 'semua')
    .map((c) => ({
      label: c.label,
      note: c.labelCn,
      to: { name: 'catalog', query: { kategori: c.id } }
    }))
])

// 路由变化时自动关掉抽屉
watch(
  () => route.fullPath,
  () => {
    drawerOpen.value = false
  }
)

const cartQty = computed(() => cart.totalQty)

function submitSearch() {
  const q = keyword.value.trim()
  if (!q) return
  router.push({ name: 'catalog', query: { q } })
}

function openCart() {
  router.push({ name: 'cart' })
}
</script>

<template>
  <header class="site-header">
    <!-- 顶部信息条 -->
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">
          <span class="topbar-item">📞 +62 877 8123 4704</span>
          <span class="topbar-item hide-mobile">✉️ sales@vim-motor-demo.co.id</span>
          <span class="topbar-item hide-mobile">📍 Surabaya, Jawa Timur</span>
        </div>
        <div class="topbar-left">
          <span class="topbar-item hide-mobile">Senin - Sabtu 08.00 - 17.00 WIB</span>
          <span class="topbar-item topbar-cn">演示站点 · Demo Only</span>
        </div>
      </div>
    </div>

    <!-- 主头部 -->
    <div class="container">
      <div class="header-main">
        <button
          class="icon-btn hide-desktop"
          type="button"
          aria-label="Buka menu"
          @click="drawerOpen = true"
        >
          ☰
        </button>

        <RouterLink class="brand" :to="{ name: 'home' }">
          <span class="brand-mark">VIM</span>
          <span class="brand-text">
            <span class="brand-name">VIM MOTOR</span>
            <span class="brand-sub">ELECTRIC MOBILITY</span>
          </span>
        </RouterLink>

        <div class="header-search">
          <form class="search-box" @submit.prevent="submitSearch">
            <input
              v-model="keyword"
              type="search"
              placeholder="Cari motor listrik, sepeda listrik…"
              aria-label="Cari produk"
            />
            <button type="submit" aria-label="Cari">🔍</button>
          </form>
        </div>

        <div class="header-actions">
          <button class="icon-btn hide-mobile" type="button" title="Akun (demo)" @click="submitSearch">
            👤
          </button>
          <button class="icon-btn" type="button" aria-label="Keranjang" @click="openCart">
            🛒
            <span v-if="cartQty > 0" class="cart-badge">{{ cartQty > 99 ? '99+' : cartQty }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 导航条：移动端横向滚动，桌面端一行平铺 -->
    <nav class="nav-bar">
      <div class="container">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.label">
            <RouterLink
              class="nav-link"
              :class="{ 'is-active': isNavActive(item) }"
              :to="item.to"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 侧边抽屉（移动端） -->
    <template v-if="drawerOpen">
      <div class="drawer-mask" @click="drawerOpen = false"></div>
      <aside class="drawer">
        <div class="drawer-head">
          <span class="fw-700">Menu</span>
          <button type="button" aria-label="Tutup" @click="drawerOpen = false">✕</button>
        </div>

        <RouterLink
          v-for="item in drawerItems"
          :key="item.label"
          class="drawer-link"
          :class="{ 'is-active': isNavActive(item) }"
          :to="item.to"
        >
          <span>{{ item.label }}</span>
          <span class="text-small text-muted">{{ item.note }}</span>
        </RouterLink>

        <RouterLink
          class="drawer-link"
          :class="{ 'is-active': isNavActive({ to: { name: 'cart' } }) }"
          :to="{ name: 'cart' }"
        >
          <span>🛒 Keranjang Belanja</span>
          <span class="tag">{{ cartQty }}</span>
        </RouterLink>
        <RouterLink
          class="drawer-link"
          :class="{ 'is-active': route.name === 'checkout' }"
          :to="{ name: 'checkout' }"
        >
          <span>🧾 Checkout</span><span>结算</span>
        </RouterLink>

        <div style="padding: 16px">
          <div class="notice notice-warn">
            <span>ℹ️</span>
            <span>这是纯前端演示 Demo，不包含真实交易与支付对接。</span>
          </div>
        </div>
      </aside>
    </template>
  </header>
</template>
