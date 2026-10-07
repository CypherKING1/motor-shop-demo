<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { products, categories, seriesList, countByCategory } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { toast } from '@/utils/toast'
import { formatIDR } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

/* -------- 筛选状态：分类 / 系列 / 价格区间 / 排序 / 关键词 -------- */
const activeCategory = ref('semua')
const activeSeries = ref('semua')
const sortBy = ref('populer')
const priceRange = ref('semua')
const keyword = ref('')
const filterOpen = ref(false)

const priceRanges = [
  { id: 'semua', label: 'Semua Harga', min: 0, max: Infinity },
  { id: 'under-10', label: '< Rp 10 juta', min: 0, max: 10000000 },
  { id: '10-20', label: 'Rp 10 - 20 juta', min: 10000000, max: 20000000 },
  { id: '20-30', label: 'Rp 20 - 30 juta', min: 20000000, max: 30000000 },
  { id: 'over-30', label: '> Rp 30 juta', min: 30000000, max: Infinity }
]

const sortOptions = [
  { id: 'populer', label: 'Paling Populer' },
  { id: 'terlaris', label: 'Terlaris' },
  { id: 'termurah', label: 'Harga Terendah' },
  { id: 'termahal', label: 'Harga Tertinggi' },
  { id: 'rating', label: 'Rating Tertinggi' },
  { id: 'nama', label: 'Nama A-Z' }
]

/** 从 URL query 同步筛选条件（首页分类卡片跳过来时生效） */
function syncFromQuery() {
  activeCategory.value = route.query.kategori || 'semua'
  activeSeries.value = route.query.seri || 'semua'
  keyword.value = route.query.q || ''
}

watch(
  () => route.query,
  () => {
    if (route.name === 'catalog') syncFromQuery()
  },
  { immediate: true }
)

const filtered = computed(() => {
  const range = priceRanges.find((r) => r.id === priceRange.value) || priceRanges[0]
  const kw = keyword.value.trim().toLowerCase()

  const list = products.filter((p) => {
    if (activeCategory.value !== 'semua' && p.category !== activeCategory.value) return false
    if (activeSeries.value !== 'semua' && p.series !== activeSeries.value) return false
    if (p.price < range.min || p.price > range.max) return false
    if (kw) {
      const haystack = `${p.name} ${p.series} ${p.shortDesc} ${p.category}`.toLowerCase()
      if (!haystack.includes(kw)) return false
    }
    return true
  })

  switch (sortBy.value) {
    case 'termurah':
      return [...list].sort((a, b) => a.price - b.price)
    case 'termahal':
      return [...list].sort((a, b) => b.price - a.price)
    case 'terlaris':
      return [...list].sort((a, b) => b.sold - a.sold)
    case 'rating':
      return [...list].sort((a, b) => b.rating - a.rating)
    case 'nama':
      return [...list].sort((a, b) => a.name.localeCompare(b.name))
    default:
      return list
  }
})

const lowestPrice = computed(() =>
  filtered.value.length ? Math.min(...filtered.value.map((p) => p.price)) : 0
)

const hasFilter = computed(
  () =>
    activeCategory.value !== 'semua' ||
    activeSeries.value !== 'semua' ||
    priceRange.value !== 'semua' ||
    !!keyword.value.trim()
)

function selectCategory(id) {
  activeCategory.value = id
  router.replace({
    name: 'catalog',
    query: { ...route.query, kategori: id === 'semua' ? undefined : id }
  })
}

function selectSeries(series) {
  activeSeries.value = series
  router.replace({
    name: 'catalog',
    query: { ...route.query, seri: series === 'semua' ? undefined : series }
  })
}

function resetFilter() {
  activeCategory.value = 'semua'
  activeSeries.value = 'semua'
  priceRange.value = 'semua'
  sortBy.value = 'populer'
  keyword.value = ''
  router.replace({ name: 'catalog' })
}

function addToCart(product) {
  cart.add(product, 1)
  toast.success(`${product.name} ditambahkan ke keranjang`)
}

/* -------- 桌面端：筛选面板常驻展开；移动端：折叠 -------- */
const isDesktop = ref(false)
let mq = null
let mqHandler = null

onMounted(() => {
  mq = window.matchMedia('(min-width: 1024px)')
  isDesktop.value = mq.matches
  mqHandler = (e) => {
    isDesktop.value = e.matches
  }
  mq.addEventListener('change', mqHandler)
})

onBeforeUnmount(() => {
  if (mq && mqHandler) mq.removeEventListener('change', mqHandler)
})
</script>

<template>
  <div class="container page">
    <!-- 面包屑 -->
    <nav class="breadcrumb">
      <RouterLink :to="{ name: 'home' }">Beranda</RouterLink>
      <span class="sep">/</span>
      <span class="current">Katalog Produk</span>
    </nav>

    <div class="catalog-layout">
      <!-- ============ 左侧筛选（移动端折叠） ============ -->
      <aside class="catalog-side">
        <button class="filter-toggle" type="button" @click="filterOpen = !filterOpen">
          <span>🔍 Filter Produk</span>
          <span>{{ filterOpen ? '▲' : '▼' }}</span>
        </button>

        <div v-show="filterOpen || isDesktop" class="filter-body">
          <div class="card filter-block">
            <div class="panel-title">Kategori</div>
            <ul class="filter-list">
              <li v-for="c in categories" :key="c.id">
                <button
                  class="filter-item"
                  :class="{ 'is-active': activeCategory === c.id }"
                  type="button"
                  @click="selectCategory(c.id)"
                >
                  <span>{{ c.label }}</span>
                  <span class="filter-count">{{ countByCategory(c.id) }}</span>
                </button>
              </li>
            </ul>
          </div>

          <div class="card filter-block">
            <div class="panel-title">Series</div>
            <ul class="filter-list">
              <li>
                <button
                  class="filter-item"
                  :class="{ 'is-active': activeSeries === 'semua' }"
                  type="button"
                  @click="selectSeries('semua')"
                >
                  <span>Semua Series</span>
                </button>
              </li>
              <li v-for="s in seriesList" :key="s">
                <button
                  class="filter-item"
                  :class="{ 'is-active': activeSeries === s }"
                  type="button"
                  @click="selectSeries(s)"
                >
                  <span>{{ s }}</span>
                </button>
              </li>
            </ul>
          </div>

          <div class="card filter-block">
            <div class="panel-title">Rentang Harga</div>
            <ul class="filter-list">
              <li v-for="r in priceRanges" :key="r.id">
                <button
                  class="filter-item"
                  :class="{ 'is-active': priceRange === r.id }"
                  type="button"
                  @click="priceRange = r.id"
                >
                  <span>{{ r.label }}</span>
                </button>
              </li>
            </ul>
          </div>

          <div class="card card-pad">
            <div class="text-small text-muted mb-8">Butuh bantuan memilih?</div>
            <div class="fw-700 mb-8">📞 +62 877 8123 4704</div>
            <div class="text-small text-muted">Senin - Sabtu · 08.00 - 17.00 WIB</div>
          </div>
        </div>
      </aside>

      <!-- ============ 右侧商品区 ============ -->
      <section class="catalog-main">
        <div class="card catalog-toolbar">
          <div class="toolbar-info">
            <h1 class="catalog-title">Katalog Produk Motor &amp; Sepeda Listrik</h1>
            <p class="text-small text-muted">
              Menampilkan <strong>{{ filtered.length }}</strong> produk
              <span v-if="filtered.length"> · mulai dari <strong>{{ formatIDR(lowestPrice) }}</strong></span>
            </p>
          </div>

          <div class="toolbar-actions">
            <button v-if="hasFilter" class="btn btn-ghost btn-sm" type="button" @click="resetFilter">
              ✕ Reset Filter
            </button>
            <select v-model="sortBy" class="select select-sm" aria-label="Urutkan">
              <option v-for="o in sortOptions" :key="o.id" :value="o.id">{{ o.label }}</option>
            </select>
          </div>
        </div>

        <!-- 已选条件 -->
        <div v-if="hasFilter" class="chips">
          <span v-if="keyword.trim()" class="chip">
            Kata kunci: {{ keyword }}
            <button type="button" @click="keyword = ''">✕</button>
          </span>
          <span v-if="activeCategory !== 'semua'" class="chip">
            {{ categories.find((c) => c.id === activeCategory)?.label }}
            <button type="button" @click="selectCategory('semua')">✕</button>
          </span>
          <span v-if="activeSeries !== 'semua'" class="chip">
            {{ activeSeries }}
            <button type="button" @click="selectSeries('semua')">✕</button>
          </span>
          <span v-if="priceRange !== 'semua'" class="chip">
            {{ priceRanges.find((r) => r.id === priceRange)?.label }}
            <button type="button" @click="priceRange = 'semua'">✕</button>
          </span>
        </div>

        <!-- 商品网格 -->
        <div v-if="filtered.length" class="product-grid mt-12">
          <ProductCard v-for="p in filtered" :key="p.id" :product="p" @add="addToCart" />
        </div>

        <!-- 空状态 -->
        <div v-else class="card empty mt-12">
          <div class="empty-icon">🔍</div>
          <div class="empty-title">Produk tidak ditemukan</div>
          <p class="text-muted text-small">
            Coba ubah kategori, series, atau rentang harga yang Anda pilih.
          </p>
          <button class="btn btn-primary mt-16" type="button" @click="resetFilter">
            Reset Filter
          </button>
        </div>

        <!-- 底部分页（演示用，静态） -->
        <div v-if="filtered.length > 4" class="pager">
          <button class="pager-btn is-active" type="button">1</button>
          <span class="text-small text-muted">
            Menampilkan seluruh {{ filtered.length }} produk
          </span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.catalog-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  align-items: start;
}

.filter-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 42px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  font-weight: 700;
  font-size: 13.5px;
  margin-bottom: 10px;
}

.filter-body {
  display: grid;
  gap: 12px;
}

.filter-block { overflow: hidden; }

.filter-list { padding: 6px; }

.filter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--c-ink-2);
  text-align: left;
  transition: background-color 0.15s, color 0.15s;
}

.filter-item:hover { background: var(--c-line-2); }

.filter-item.is-active {
  background: var(--c-brand-soft);
  color: var(--c-brand);
  font-weight: 700;
}

.filter-count {
  font-size: 11px;
  color: var(--c-muted-2);
}

.catalog-toolbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.catalog-title {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-sm {
  height: 32px;
  width: auto;
  min-width: 150px;
  font-size: 12.5px;
  padding: 0 8px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px 3px 10px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--c-brand);
  color: var(--c-brand);
  font-size: 12px;
  font-weight: 600;
}

.chip button {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--c-brand-soft);
  color: var(--c-brand);
  font-size: 10px;
  line-height: 1;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 22px 0 0;
}

.pager-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-line);
  background: #fff;
  font-weight: 700;
  font-size: 13px;
}

.pager-btn.is-active {
  background: var(--c-brand);
  border-color: var(--c-brand);
  color: #fff;
}

@media (min-width: 1024px) {
  .catalog-layout { grid-template-columns: 236px minmax(0, 1fr); gap: 18px; }
  .filter-toggle { display: none; }
  .catalog-side { position: sticky; top: calc(var(--header-h) + 52px); }
  .catalog-toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
  }
  .catalog-title { font-size: 18px; }
}
</style>
