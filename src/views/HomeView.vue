<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { featuredProducts, products, categories, countByCategory } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { toast } from '@/utils/toast'
import { handleImageError, assetUrl } from '@/utils/format'

const router = useRouter()
const cart = useCartStore()

/* ---------------- Hero 轮播 ---------------- */
const slides = [
  {
    eyebrow: 'PT. VIM ELECTRIC MOBILITY · SURABAYA',
    title: 'Mobilitas Modern,',
    titleAccent: 'Hemat & Ramah Lingkungan',
    desc:
      'Motor listrik dan sepeda listrik untuk kebutuhan harian Anda. Biaya operasional hingga 80% lebih murah dibanding kendaraan berbahan bakar.',
    image: '/images/banner/hero-1.jpg'
  },
  {
    eyebrow: 'SWAP SERIES',
    title: 'Bebas Ganti Baterai,',
    titleAccent: 'Tanpa Tunggu Charging',
    desc:
      'Tukar baterai kosong dengan yang penuh di gerai VIM terdekat. Kembali berkendara dalam hitungan menit.',
    image: '/images/banner/hero-2.jpg'
  },
  {
    eyebrow: 'GARANSI RESMI',
    title: 'Garansi Menyeluruh',
    titleAccent: 'untuk Kepercayaan Anda',
    desc:
      'Garansi resmi unit dan baterai, jaringan servis di kota-kota besar, serta cicilan 0% hingga 12 bulan.',
    image: '/images/banner/hero-3.jpg'
  }
]

const active = ref(0)
let timer = null

onMounted(() => {
  timer = window.setInterval(() => {
    active.value = (active.value + 1) % slides.length
  }, 5200)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})

const current = computed(() => slides[active.value])

/* ---------------- 服务承诺 ---------------- */
const services = [
  { icon: '🛡️', title: 'Garansi Resmi', desc: 'Unit & baterai 1 tahun' },
  { icon: '🚚', title: 'Gratis Ongkir', desc: 'Min. belanja Rp 20 juta' },
  { icon: '💳', title: 'Cicilan 0%', desc: 'Hingga 12 bulan' },
  { icon: '🔧', title: 'Servis Resmi', desc: '100+ gerai mitra' }
]

/* ---------------- 分类入口 ---------------- */
const quickCategories = [
  { id: 'motor-listrik', label: 'Motor Listrik', emoji: '🏍️' },
  { id: 'sepeda-listrik', label: 'Sepeda Listrik', emoji: '🚲' },
  { id: 'sepeda-dual-drive', label: 'Sepeda Dual Drive', emoji: '⚡' },
  { id: 'semua', label: 'Semua Produk', emoji: '🛍️' }
]

/* ---------------- 客户评价 ---------------- */
const reviews = [
  {
    name: 'Budi Santoso',
    city: 'Surabaya',
    text: 'Sudah 8 bulan pakai S-500 Unicorn untuk antar anak sekolah. Hemat banget, sebulan cuma habis Rp 60 ribu listrik.',
    rating: 5
  },
  {
    name: 'Rina Kusuma',
    city: 'Jakarta',
    text: 'SL-600 Bujana Plus sistem swap-nya sangat membantu. Tidak perlu antre charging, tinggal tukar di gerai.',
    rating: 5
  },
  {
    name: 'Agus Prasetyo',
    city: 'Bandung',
    text: 'Medan Bandung naik turun, Myatu Flip dual drive-nya kuat. Pengerjaan rapi dan pengiriman cepat.',
    rating: 4
  }
]

/* ---------------- 加入购物车 ---------------- */
function addToCart(product) {
  cart.add(product, 1)
  toast.success(`${product.name} ditambahkan ke keranjang`)
}

function goCatalog(categoryId) {
  router.push({ name: 'catalog', query: categoryId === 'semua' ? {} : { kategori: categoryId } })
}
</script>

<template>
  <div>
    <!-- ============ Hero ============ -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-cn"></div>

      <div class="container">
        <div class="hero-inner">
          <div class="hero-content">
            <span class="hero-eyebrow">◆ {{ current.eyebrow }}</span>
            <h1 class="hero-title">
              {{ current.title }}<br />
              <em>{{ current.titleAccent }}</em>
            </h1>
            <p class="hero-desc">{{ current.desc }}</p>

            <div class="hero-cta">
              <RouterLink class="btn btn-primary btn-lg" :to="{ name: 'catalog' }">
                Lihat Produk
              </RouterLink>
              <RouterLink class="btn btn-dark btn-lg" :to="{ name: 'cart' }">
                Keranjang Saya
              </RouterLink>
            </div>

            <div class="hero-stats">
              <div>
                <div class="hero-stat-num">10+</div>
                <div class="hero-stat-label">Model Tersedia</div>
              </div>
              <div>
                <div class="hero-stat-num">6.100+</div>
                <div class="hero-stat-label">Unit Terkirim</div>
              </div>
              <div>
                <div class="hero-stat-num">100+</div>
                <div class="hero-stat-label">Gerai Servis</div>
              </div>
            </div>
          </div>

          <div class="hero-visual">
            <img :src="assetUrl(current.image)" :alt="current.title" @error="handleImageError" />
          </div>
        </div>

        <div class="hero-dots">
          <button
            v-for="(s, i) in slides"
            :key="s.eyebrow"
            class="hero-dot"
            :class="{ 'is-active': i === active }"
            type="button"
            :aria-label="`Slide ${i + 1}`"
            @click="active = i"
          ></button>
        </div>
      </div>
    </section>

    <div class="container">
      <!-- ============ 服务承诺 ============ -->
      <div class="service-strip">
        <div v-for="s in services" :key="s.title" class="service-item">
          <span class="service-icon">{{ s.icon }}</span>
          <div>
            <div class="service-title">{{ s.title }}</div>
            <div class="service-desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>

      <!-- ============ 分类快捷入口 ============ -->
      <div class="cat-quick">
        <button
          v-for="c in quickCategories"
          :key="c.id"
          class="cat-item"
          type="button"
          @click="goCatalog(c.id)"
        >
          <span class="cat-emoji">{{ c.emoji }}</span>
          <span class="cat-label">{{ c.label }}</span>
          <span class="cat-count">{{ countByCategory(c.id) }} produk</span>
        </button>
      </div>

      <!-- ============ 促销横幅 ============ -->
      <section class="section">
        <div class="promo-banner">
          <div>
            <span class="tag tag-orange">SWAP SERIES</span>
            <h2 class="promo-title">Bebas Ganti Batre dengan SWAP SERIES</h2>
            <p class="promo-desc">
              Tidak perlu menunggu berjam-jam mengisi daya. Tukar baterai kosong Anda dengan yang penuh
              di gerai VIM terdekat dan lanjut berkendara.
            </p>
          </div>
          <RouterLink
            class="btn btn-primary btn-lg"
            :to="{ name: 'catalog', query: { seri: 'Swap Series' } }"
          >
            Lihat Seri SWAP
          </RouterLink>
        </div>
      </section>

      <!-- ============ 商品列表 ============ -->
      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Produk Unggulan VIM</h2>
            <p class="section-sub">
              Harga resmi dalam Rupiah · {{ products.length }} model tersedia
            </p>
          </div>
          <RouterLink class="section-more" :to="{ name: 'catalog' }">
            Lihat Semua Produk →
          </RouterLink>
        </div>

        <div class="product-grid">
          <ProductCard
            v-for="p in featuredProducts"
            :key="p.id"
            :product="p"
            @add="addToCart"
          />
        </div>
      </section>

      <!-- ============ 客户评价 ============ -->
      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Kata Pelanggan Kami</h2>
            <p class="section-sub">Rating rata-rata 4,8 dari 6.100+ unit terkirim</p>
          </div>
        </div>

        <div class="review-grid">
          <div v-for="r in reviews" :key="r.name" class="card card-pad review-card">
            <div class="review-stars">
              <span v-for="n in 5" :key="n" :class="n <= r.rating ? 'on' : 'off'">★</span>
            </div>
            <p class="review-text">"{{ r.text }}"</p>
            <div class="review-user">
              <span class="review-avatar">{{ r.name.charAt(0) }}</span>
              <div>
                <div class="fw-700">{{ r.name }}</div>
                <div class="text-small text-muted">{{ r.city }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 分类浏览 ============ -->
      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Belanja per Kategori</h2>
          </div>
        </div>

        <div class="cat-cards">
          <button
            v-for="c in categories.filter((x) => x.id !== 'semua')"
            :key="c.id"
            class="cat-card"
            type="button"
            @click="goCatalog(c.id)"
          >
            <div class="cat-card-title">{{ c.label }}</div>
            <div class="cat-card-cn">{{ c.labelCn }}</div>
            <div class="cat-card-count">{{ countByCategory(c.id) }} produk</div>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.promo-banner {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border-radius: var(--radius-lg);
  background: linear-gradient(110deg, #14181f 0%, #262b33 55%, #3b2027 100%);
  color: #fff;
}

.promo-title {
  font-size: 19px;
  font-weight: 900;
  margin: 10px 0 6px;
}

.promo-desc {
  font-size: 13px;
  color: #a9b1bd;
  max-width: 640px;
}

.promo-banner .btn {
  align-self: flex-start;
}

.review-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.review-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-stars {
  font-size: 15px;
  letter-spacing: 2px;
}

.review-stars .on { color: var(--c-accent); }
.review-stars .off { color: var(--c-line); }

.review-text {
  font-size: 13px;
  color: var(--c-ink-2);
  line-height: 1.7;
  flex: 1 1 auto;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--c-line-2);
  font-size: 13px;
}

.review-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--c-brand-soft);
  color: var(--c-brand);
  display: grid;
  place-items: center;
  font-weight: 800;
}

.cat-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.cat-card {
  position: relative;
  padding: 18px;
  border-radius: var(--radius);
  border: 1px solid var(--c-line);
  background: #fff;
  text-align: left;
  overflow: hidden;
  transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
}

.cat-card::after {
  content: '';
  position: absolute;
  right: -30px;
  top: -30px;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--c-brand-soft);
  transition: transform 0.25s;
}

.cat-card:hover {
  border-color: var(--c-brand);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.cat-card:hover::after { transform: scale(1.25); }

.cat-card-title {
  position: relative;
  font-size: 15px;
  font-weight: 800;
}

.cat-card-cn {
  position: relative;
  font-size: 12px;
  color: var(--c-muted);
  margin-top: 2px;
}

.cat-card-count {
  position: relative;
  font-size: 12px;
  font-weight: 700;
  color: var(--c-brand);
  margin-top: 10px;
}

@media (min-width: 768px) {
  .promo-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 28px 32px;
  }
  .promo-banner .btn { align-self: center; }
  .promo-title { font-size: 24px; }
  .promo-desc { font-size: 14px; }
  .review-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
  .cat-cards { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
}
</style>
