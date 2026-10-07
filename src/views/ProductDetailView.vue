<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import QtyStepper from '@/components/QtyStepper.vue'
import ProductCard from '@/components/ProductCard.vue'
import { getProductById, getRelatedProducts } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { toast } from '@/utils/toast'
import { formatIDR, handleImageError, discountPercent, assetUrl } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const qty = ref(1)
const activeTab = ref('deskripsi')
const activeImage = ref(0)

const product = computed(() => getProductById(route.params.id))

/** 主图列表：products.js 里给商品加 gallery 数组即可启用多图，否则只用主图 */
const gallery = computed(() => {
  if (!product.value) return []
  return product.value.gallery?.length ? product.value.gallery : [product.value.image]
})

const related = computed(() => getRelatedProducts(product.value, 4))

const hasDiscount = computed(
  () => !!product.value && product.value.oldPrice > product.value.price
)
const discount = computed(() =>
  product.value ? discountPercent(product.value.price, product.value.oldPrice) : 0
)

const tabs = [
  { id: 'deskripsi', label: 'Deskripsi' },
  { id: 'spesifikasi', label: 'Spesifikasi' },
  { id: 'fitur', label: 'Fitur & Garansi' }
]

// 切换商品时重置页面状态
watch(
  () => route.params.id,
  () => {
    qty.value = 1
    activeImage.value = 0
    activeTab.value = 'deskripsi'
  }
)

function addToCart() {
  if (!product.value) return
  cart.add(product.value, qty.value)
  toast.success(`${qty.value} × ${product.value.name} masuk keranjang`)
}

function buyNow() {
  if (!product.value) return
  cart.add(product.value, qty.value)
  toast.success('Lanjut ke keranjang…')
  router.push({ name: 'cart' })
}

function onAddRelated(p) {
  cart.add(p, 1)
  toast.success(`${p.name} ditambahkan ke keranjang`)
}
</script>

<template>
  <div class="container page">
    <!-- ============ 商品不存在 ============ -->
    <template v-if="!product">
      <nav class="breadcrumb">
        <RouterLink :to="{ name: 'home' }">Beranda</RouterLink>
        <span class="sep">/</span>
        <span class="current">Produk tidak ditemukan</span>
      </nav>
      <div class="card empty">
        <div class="empty-icon">🤔</div>
        <div class="empty-title">Produk tidak ditemukan</div>
        <p class="text-muted text-small">
          Produk yang Anda cari mungkin sudah tidak tersedia atau tautannya salah.
        </p>
        <RouterLink class="btn btn-primary mt-16" :to="{ name: 'catalog' }">
          Kembali ke Katalog
        </RouterLink>
      </div>
    </template>

    <template v-else>
      <!-- ============ 面包屑 ============ -->
      <nav class="breadcrumb">
        <RouterLink :to="{ name: 'home' }">Beranda</RouterLink>
        <span class="sep">/</span>
        <RouterLink :to="{ name: 'catalog' }">Katalog</RouterLink>
        <span class="sep">/</span>
        <RouterLink
          :to="{ name: 'catalog', query: { kategori: product.category } }"
        >
          {{ product.series }}
        </RouterLink>
        <span class="sep">/</span>
        <span class="current">{{ product.name }}</span>
      </nav>

      <!-- ============ 主区域 ============ -->
      <div class="detail-top">
        <!-- 左：图片 -->
        <div class="gallery">
          <div class="gallery-main">
            <img
              :src="assetUrl(gallery[activeImage])"
              :alt="product.name"
              @error="handleImageError"
            />
            <span v-if="product.badge" class="tag tag-dark gallery-badge">
              {{ product.badge }}
            </span>
          </div>

          <div v-if="gallery.length > 1" class="gallery-thumbs">
            <button
              v-for="(img, i) in gallery"
              :key="img + i"
              class="gallery-thumb"
              :class="{ 'is-active': i === activeImage }"
              type="button"
              @click="activeImage = i"
            >
              <img
                :src="assetUrl(img)"
                :alt="`${product.name} ${i + 1}`"
                @error="handleImageError"
              />
            </button>
          </div>

          <!-- 图片替换提示（Demo 用，正式展示可删掉这一段） -->
          <div class="notice notice-info mt-12">
            <span>🖼️</span>
            <span>
              演示占位图。把你自己的摩托车照片放到
              <code>public/images/motors/</code> 并命名为
              <code>{{ product.slug }}.jpg</code>，刷新后自动替换。
            </span>
          </div>
        </div>

        <!-- 右：信息 -->
        <div class="detail-info">
          <span class="pcard-series">{{ product.series }}</span>
          <h1 class="detail-title">{{ product.name }}</h1>

          <div class="detail-meta">
            <span>⭐ {{ product.rating }}</span>
            <span>{{ product.sold }} terjual</span>
            <span
              :class="product.stock > 0 ? 'text-brand' : 'text-muted'"
              class="fw-700"
            >
              {{ product.stock > 0 ? `Stok ${product.stock} unit` : 'Stok habis' }}
            </span>
          </div>

          <p class="text-muted mt-12" style="font-size: 13.5px">{{ product.shortDesc }}</p>

          <!-- 价格 -->
          <div class="detail-price-box">
            <div class="detail-price-row">
              <span class="price price-xl">{{ formatIDR(product.price) }}</span>
              <span v-if="hasDiscount" class="price-old">{{ formatIDR(product.oldPrice) }}</span>
              <span v-if="hasDiscount" class="tag">Hemat {{ discount }}%</span>
            </div>
            <div class="text-small text-muted mt-8">
              Harga OTR Surabaya · sudah termasuk PPN
            </div>
          </div>

          <!-- 关键参数 -->
          <div class="detail-spec-mini">
            <div v-for="s in product.specs.slice(0, 4)" :key="s.label" class="spec-mini">
              <div class="spec-mini-label">{{ s.label }}</div>
              <div class="spec-mini-value">{{ s.value }}</div>
            </div>
          </div>

          <!-- 购买区 -->
          <div class="detail-buy">
            <div class="qty-row">
              <span class="qty-label">Jumlah</span>
              <QtyStepper v-model="qty" :min="1" :max="Math.min(product.stock, 10) || 1" />
              <span class="text-small text-muted">
                Total: <strong class="text-brand">{{ formatIDR(product.price * qty) }}</strong>
              </span>
            </div>

            <div class="detail-cta">
              <button
                class="btn btn-outline btn-lg span-full"
                type="button"
                @click="addToCart"
              >
                + Tambah ke Keranjang
              </button>
              <button class="btn btn-primary btn-lg" type="button" @click="buyNow">
                Beli Sekarang
              </button>
              <button
                class="btn btn-ghost btn-lg"
                type="button"
                @click="toast.info('Fitur wishlist hanya demo')"
              >
                ♡ Simpan
              </button>
            </div>

            <div class="notice notice-warn mt-12">
              <span>ℹ️</span>
              <span>
                Ini halaman demo. Tombol di atas hanya menambah data ke keranjang lokal (localStorage)
                — tidak ada transaksi atau pembayaran nyata.
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ 选项卡 ============ -->
      <div class="card mt-16">
        <div class="tabs">
          <button
            v-for="t in tabs"
            :key="t.id"
            class="tab"
            :class="{ 'is-active': activeTab === t.id }"
            type="button"
            @click="activeTab = t.id"
          >
            {{ t.label }}
          </button>
        </div>

        <div v-if="activeTab === 'deskripsi'" class="tab-panel">
          <p>{{ product.description }}</p>
        </div>

        <div v-else-if="activeTab === 'spesifikasi'" class="tab-panel">
          <table class="spec-table">
            <tbody>
              <tr v-for="s in product.specs" :key="s.label">
                <th>{{ s.label }}</th>
                <td>{{ s.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="tab-panel">
          <div class="feature-list">
            <div v-for="f in product.features" :key="f" class="feature-item">
              <span class="feature-check">✓</span>
              <span>{{ f }}</span>
            </div>
          </div>

          <div class="notice notice-info mt-16">
            <span>🛡️</span>
            <span>
              Garansi unit 1 tahun, garansi baterai 6 bulan (SLA) / 1 tahun (Lithium).
              Servis gratis 3 kali di gerai mitra VIM.
            </span>
          </div>
        </div>
      </div>

      <!-- ============ 相关推荐 ============ -->
      <section v-if="related.length" class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Produk Lainnya</h2>
            <p class="section-sub">Rekomendasi dari seri dan kategori yang sama</p>
          </div>
          <RouterLink class="section-more" :to="{ name: 'catalog' }">
            Lihat Semua →
          </RouterLink>
        </div>

        <div class="product-grid">
          <ProductCard v-for="p in related" :key="p.id" :product="p" @add="onAddRelated" />
        </div>
      </section>

      <!-- ============ 移动端底部购买栏 ============ -->
      <div class="detail-bottom-bar">
        <div class="bottom-price">
          <div class="price price-md">{{ formatIDR(product.price) }}</div>
          <div class="text-small text-muted">Stok {{ product.stock }} unit</div>
        </div>
        <button class="btn btn-primary btn-lg" type="button" @click="addToCart">
          + Keranjang
        </button>
        <button class="btn btn-dark btn-lg" type="button" @click="buyNow">Beli</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.97);
  border-top: 1px solid var(--c-line);
  box-shadow: 0 -4px 16px rgba(16, 24, 40, 0.08);
  backdrop-filter: blur(8px);
}

.bottom-price {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 1.25;
}

.bottom-price .price { white-space: nowrap; }

/* 给底部栏留出空间，避免遮住页脚 */
.page { padding-bottom: 92px; }

@media (min-width: 1024px) {
  .detail-bottom-bar { display: none; }
  .page { padding-bottom: 40px; }
}
</style>
