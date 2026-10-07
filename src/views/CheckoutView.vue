<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppDialog from '@/components/AppDialog.vue'
import { useCartStore } from '@/stores/cart'
import { toast } from '@/utils/toast'
import { formatIDR, handleImageError, generateOrderNo, assetUrl } from '@/utils/format'

const router = useRouter()
const cart = useCartStore()

/* ============================ 表单 ============================ */
const form = reactive({
  nama: '',
  telepon: '',
  email: '',
  alamat: '',
  kota: '',
  kecamatan: '',
  kodepos: '',
  catatan: ''
})

const errors = reactive({})
const touched = ref(false)

const cities = [
  'Jakarta',
  'Tangerang',
  'Bekasi',
  'Depok',
  'Bogor',
  'Bandung',
  'Semarang',
  'Yogyakarta',
  'Surabaya',
  'Sidoarjo',
  'Malang',
  'Denpasar',
  'Medan',
  'Palembang',
  'Makassar',
  'Balikpapan'
]

const rules = {
  nama: (v) => (v.trim().length >= 3 ? '' : 'Nama penerima minimal 3 karakter'),
  telepon: (v) =>
    /^(\+?62|0)8[1-9][0-9]{6,11}$/.test(v.replace(/[\s-]/g, ''))
      ? ''
      : 'Nomor WhatsApp tidak valid (contoh: 08123456789)',
  email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Format email tidak valid'),
  alamat: (v) => (v.trim().length >= 10 ? '' : 'Alamat lengkap minimal 10 karakter'),
  kota: (v) => (v ? '' : 'Pilih kota pengiriman'),
  kecamatan: (v) => (v.trim().length >= 3 ? '' : 'Kecamatan wajib diisi'),
  kodepos: (v) => (/^[0-9]{5}$/.test(v.trim()) ? '' : 'Kode pos harus 5 digit angka')
}

function validateField(key) {
  const rule = rules[key]
  if (!rule) return true
  const message = rule(form[key] ?? '')
  if (message) errors[key] = message
  else delete errors[key]
  return !message
}

function validateAll() {
  touched.value = true
  let ok = true
  Object.keys(rules).forEach((key) => {
    if (!validateField(key)) ok = false
  })
  if (!agreed.value) {
    toast.error('Centang persetujuan syarat & ketentuan terlebih dahulu')
    ok = false
  }
  return ok
}

/* ============================ 配送方式 ============================ */
const FREE_SHIPPING_MIN = 20000000

const shippingMethods = [
  {
    id: 'reguler',
    title: 'Reguler',
    desc: 'Estimasi 3 - 5 hari kerja · ekspedisi mitra',
    fee: 250000
  },
  {
    id: 'express',
    title: 'Express',
    desc: 'Estimasi 1 - 2 hari kerja · prioritas',
    fee: 550000
  },
  {
    id: 'pickup',
    title: 'Ambil di Gerai',
    desc: 'Gratis · Jl. Rungkut Industri, Surabaya',
    fee: 0
  }
]

const shippingId = ref('reguler')

const shippingFee = computed(() => {
  const method = shippingMethods.find((m) => m.id === shippingId.value)
  if (!method) return 0
  if (method.fee === 0) return 0
  // 满额免运费
  return cart.subtotal >= FREE_SHIPPING_MIN ? 0 : method.fee
})

const shippingLabel = computed(() => (shippingFee.value === 0 ? 'GRATIS' : formatIDR(shippingFee.value)))

/* ============================ 支付方式（仅演示） ============================ */
const paymentMethods = [
  {
    id: 'transfer',
    title: 'Transfer Bank',
    desc: 'BCA · Mandiri · BNI · BRI',
    badge: 'Manual'
  },
  {
    id: 'va',
    title: 'Virtual Account',
    desc: 'Nomor VA otomatis per pesanan',
    badge: 'Otomatis'
  },
  {
    id: 'qris',
    title: 'QRIS',
    desc: 'Scan sekali, semua e-wallet & mobile banking',
    badge: 'Instan'
  },
  {
    id: 'card',
    title: 'Kartu Kredit / Debit',
    desc: 'Visa · Mastercard · JCB',
    badge: '3D Secure'
  },
  {
    id: 'cod',
    title: 'COD (Bayar di Tempat)',
    desc: 'Bayar saat unit diterima',
    badge: 'Surabaya'
  }
]

const paymentId = ref('va')
const agreed = ref(false)

/* ============================ 金额 ============================ */
const total = computed(() => cart.subtotal + shippingFee.value)

/* ============================ 提交订单 ============================ */
const successOpen = ref(false)
const orderNo = ref('')
const submitted = reactive({ method: '', total: 0, name: '' })

function submitOrder() {
  if (cart.isEmpty) {
    toast.error('Keranjang masih kosong')
    return
  }
  if (!validateAll()) {
    toast.error('Mohon lengkapi data yang wajib diisi')
    // 滚动到第一个错误字段
    const firstKey = Object.keys(errors)[0]
    if (firstKey) {
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  // ⚠️ 纯前端演示：这里不做任何网络请求、不接支付网关
  orderNo.value = generateOrderNo()
  submitted.method = paymentMethods.find((m) => m.id === paymentId.value)?.title || '-'
  submitted.total = total.value
  submitted.name = form.nama
  successOpen.value = true
}

/** 弹窗确认后：清空购物车并回到首页（仍是本地模拟） */
function onSuccessConfirm() {
  successOpen.value = false
  cart.clear()
  toast.success('Terima kasih! (demo)')
  router.push({ name: 'home' })
}

function onSuccessCancel() {
  successOpen.value = false
}
</script>

<template>
  <div class="container page">
    <nav class="breadcrumb">
      <RouterLink :to="{ name: 'home' }">Beranda</RouterLink>
      <span class="sep">/</span>
      <RouterLink :to="{ name: 'cart' }">Keranjang</RouterLink>
      <span class="sep">/</span>
      <span class="current">Checkout</span>
    </nav>

    <!-- ============ 步骤条 ============ -->
    <div class="step-bar">
      <span class="step-item is-done"><span class="step-num">✓</span> Keranjang</span>
      <span class="step-sep">──────</span>
      <span class="step-item is-active"><span class="step-num">2</span> Checkout</span>
      <span class="step-sep">──────</span>
      <span class="step-item"><span class="step-num">3</span> Selesai</span>
    </div>

    <h1 class="page-title">Checkout</h1>
    <p class="text-small text-muted mb-16">
      Lengkapi data pengiriman di bawah ini, lalu tekan <strong>Buat Pesanan</strong>.
    </p>

    <!-- ============ 空购物车 ============ -->
    <div v-if="cart.isEmpty" class="card empty">
      <div class="empty-icon">🧾</div>
      <div class="empty-title">Tidak ada produk untuk di-checkout</div>
      <p class="text-muted text-small">Keranjang Anda kosong. Silakan pilih produk terlebih dahulu.</p>
      <RouterLink class="btn btn-primary btn-lg mt-16" :to="{ name: 'catalog' }">
        Lihat Katalog Produk
      </RouterLink>
    </div>

    <!-- ============ 结算主体 ============ -->
    <div v-else class="checkout-layout">
      <!-- ================= 左：表单 ================= -->
      <div class="stack-16">
        <!-- 收货信息 -->
        <section class="card">
          <div class="panel-title">Informasi Penerima</div>
          <div class="card-pad">
            <div class="form-grid">
              <div class="field">
                <label class="field-label" for="field-nama">
                  Nama Penerima <span class="req">*</span>
                </label>
                <input
                  id="field-nama"
                  v-model="form.nama"
                  class="input"
                  :class="{ 'is-error': errors.nama }"
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  @blur="validateField('nama')"
                />
                <div v-if="errors.nama" class="field-error">{{ errors.nama }}</div>
              </div>

              <div class="field">
                <label class="field-label" for="field-telepon">
                  No. WhatsApp <span class="req">*</span>
                </label>
                <input
                  id="field-telepon"
                  v-model="form.telepon"
                  class="input"
                  :class="{ 'is-error': errors.telepon }"
                  type="tel"
                  inputmode="tel"
                  placeholder="08123456789"
                  @blur="validateField('telepon')"
                />
                <div v-if="errors.telepon" class="field-error">{{ errors.telepon }}</div>
              </div>

              <div class="field span-2">
                <label class="field-label" for="field-email">Email (opsional)</label>
                <input
                  id="field-email"
                  v-model="form.email"
                  class="input"
                  :class="{ 'is-error': errors.email }"
                  type="email"
                  placeholder="nama@email.com"
                  @blur="validateField('email')"
                />
                <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
              </div>

              <div class="field span-2">
                <label class="field-label" for="field-alamat">
                  Alamat Lengkap <span class="req">*</span>
                </label>
                <textarea
                  id="field-alamat"
                  v-model="form.alamat"
                  class="textarea"
                  :class="{ 'is-error': errors.alamat }"
                  placeholder="Nama jalan, nomor rumah, RT/RW, patokan…"
                  @blur="validateField('alamat')"
                ></textarea>
                <div v-if="errors.alamat" class="field-error">{{ errors.alamat }}</div>
              </div>

              <div class="field">
                <label class="field-label" for="field-kota">
                  Kota / Kabupaten <span class="req">*</span>
                </label>
                <select
                  id="field-kota"
                  v-model="form.kota"
                  class="select"
                  :class="{ 'is-error': errors.kota }"
                  @change="validateField('kota')"
                >
                  <option value="">— Pilih Kota —</option>
                  <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                </select>
                <div v-if="errors.kota" class="field-error">{{ errors.kota }}</div>
              </div>

              <div class="field">
                <label class="field-label" for="field-kecamatan">
                  Kecamatan <span class="req">*</span>
                </label>
                <input
                  id="field-kecamatan"
                  v-model="form.kecamatan"
                  class="input"
                  :class="{ 'is-error': errors.kecamatan }"
                  type="text"
                  placeholder="Contoh: Rungkut"
                  @blur="validateField('kecamatan')"
                />
                <div v-if="errors.kecamatan" class="field-error">{{ errors.kecamatan }}</div>
              </div>

              <div class="field">
                <label class="field-label" for="field-kodepos">
                  Kode Pos <span class="req">*</span>
                </label>
                <input
                  id="field-kodepos"
                  v-model="form.kodepos"
                  class="input"
                  :class="{ 'is-error': errors.kodepos }"
                  type="text"
                  inputmode="numeric"
                  maxlength="5"
                  placeholder="60293"
                  @blur="validateField('kodepos')"
                />
                <div v-if="errors.kodepos" class="field-error">{{ errors.kodepos }}</div>
              </div>

              <div class="field">
                <label class="field-label" for="field-catatan">Catatan (opsional)</label>
                <input
                  id="field-catatan"
                  v-model="form.catatan"
                  class="input"
                  type="text"
                  placeholder="Contoh: kirim setelah jam 15.00"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- 配送方式 -->
        <section class="card">
          <div class="panel-title">Metode Pengiriman</div>
          <div class="card-pad">
            <div class="option-list">
              <label
                v-for="m in shippingMethods"
                :key="m.id"
                class="option"
                :class="{ 'is-active': shippingId === m.id }"
              >
                <input v-model="shippingId" type="radio" name="shipping" :value="m.id" />
                <span class="option-body">
                  <span class="option-title">{{ m.title }}</span>
                  <span class="option-desc">{{ m.desc }}</span>
                </span>
                <span class="option-price">
                  <template v-if="m.fee === 0 || cart.subtotal >= FREE_SHIPPING_MIN">
                    <span class="text-brand">GRATIS</span>
                  </template>
                  <template v-else>{{ formatIDR(m.fee) }}</template>
                </span>
              </label>
            </div>

            <div v-if="cart.subtotal >= FREE_SHIPPING_MIN" class="notice notice-info mt-12">
              <span>🎉</span>
              <span>Selamat! Belanja Anda di atas {{ formatIDR(FREE_SHIPPING_MIN) }} — ongkir gratis.</span>
            </div>
          </div>
        </section>

        <!-- 支付方式 -->
        <section class="card">
          <div class="panel-title">Metode Pembayaran</div>
          <div class="card-pad">
            <div class="option-list">
              <label
                v-for="p in paymentMethods"
                :key="p.id"
                class="option"
                :class="{ 'is-active': paymentId === p.id }"
              >
                <input v-model="paymentId" type="radio" name="payment" :value="p.id" />
                <span class="option-body">
                  <span class="option-title">{{ p.title }}</span>
                  <span class="option-desc">{{ p.desc }}</span>
                </span>
                <span class="tag tag-gray">{{ p.badge }}</span>
              </label>
            </div>

            <div class="notice notice-warn mt-12">
              <span>⚠️</span>
              <span>
                <strong>Demo only:</strong> pilihan pembayaran di atas hanya tampilan.
                本页面不接入任何支付网关，不会产生真实扣款。
              </span>
            </div>
          </div>
        </section>
      </div>

      <!-- ================= 右：订单清单 ================= -->
      <aside class="summary is-sticky">
        <div class="panel-title">Ringkasan Pesanan</div>

        <div style="padding: 12px 14px">
          <!-- 商品清单 -->
          <div class="order-items">
            <div v-for="item in cart.details" :key="item.id" class="order-item">
              <div class="order-thumb">
                <img :src="assetUrl(item.image)" :alt="item.name" @error="handleImageError" />
              </div>
              <div style="min-width: 0">
                <div class="order-name">{{ item.name }}</div>
                <div class="order-qty">
                  {{ formatIDR(item.price) }} × {{ item.qty }}
                </div>
              </div>
              <div class="order-price">{{ formatIDR(item.subtotal) }}</div>
            </div>
          </div>

          <!-- 金额 -->
          <div class="summary-row" style="border-top: 1px dashed var(--c-line); margin-top: 8px">
            <span class="label">Subtotal ({{ cart.totalQty }} unit)</span>
            <span class="value">{{ formatIDR(cart.subtotal) }}</span>
          </div>

          <div v-if="cart.totalSaving > 0" class="summary-row">
            <span class="label">Total Diskon</span>
            <span class="value text-brand">-{{ formatIDR(cart.totalSaving) }}</span>
          </div>

          <div class="summary-row">
            <span class="label">Ongkos Kirim</span>
            <span class="value" :class="{ 'text-brand': shippingFee === 0 }">
              {{ shippingLabel }}
            </span>
          </div>

          <div class="summary-total">
            <span class="label">Total Bayar</span>
            <span class="value">{{ formatIDR(total) }}</span>
          </div>

          <!-- 提交 -->
          <button class="btn btn-primary btn-lg btn-block mt-12" type="button" @click="submitOrder">
            Buat Pesanan
          </button>

          <label class="checkbox-row mt-12">
            <input v-model="agreed" type="checkbox" />
            <span>
              Saya menyetujui Syarat &amp; Ketentuan serta Kebijakan Privasi.
              <em>(Demo — tidak ada pesanan nyata yang dibuat)</em>
            </span>
          </label>

          <div v-if="touched && !agreed" class="field-error" style="text-align: left">
            Persetujuan syarat &amp; ketentuan wajib dicentang.
          </div>

          <RouterLink
            class="btn btn-ghost btn-block mt-8"
            :to="{ name: 'cart' }"
            style="text-decoration: none"
          >
            ← Kembali ke Keranjang
          </RouterLink>

          <p class="text-small text-muted mt-12" style="text-align: center">
            🔒 Halaman demo · tidak ada transaksi nyata
          </p>
        </div>
      </aside>
    </div>

    <!-- ============ 下单成功弹窗 ============ -->
    <AppDialog
      v-model="successOpen"
      title="Pesanan Berhasil Dibuat"
      confirm-text="Selesai"
      cancel-text="Tutup"
      :close-on-mask="false"
      @confirm="onSuccessConfirm"
      @cancel="onSuccessCancel"
    >
      <template #icon>
        <div class="success-icon">✓</div>
      </template>

      <p style="margin-bottom: 10px">
        <strong>订单提交成功</strong> · Terima kasih, {{ submitted.name || 'Pelanggan' }}!
      </p>

      <div class="success-detail">
        <div class="success-row">
          <span>No. Pesanan</span><strong>{{ orderNo }}</strong>
        </div>
        <div class="success-row">
          <span>Metode Pembayaran</span><strong>{{ submitted.method }}</strong>
        </div>
        <div class="success-row">
          <span>Total Bayar</span>
          <strong class="text-brand">{{ formatIDR(submitted.total) }}</strong>
        </div>
      </div>

      <div class="notice notice-warn mt-12" style="text-align: left">
        <span>ℹ️</span>
        <span>
          这是演示页面：订单号与金额均为本地模拟生成，未提交到任何服务器，
          也未对接支付网关，不会产生真实订单或扣款。
        </span>
      </div>
    </AppDialog>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 19px;
  font-weight: 800;
}

.order-items {
  max-height: 280px;
  overflow-y: auto;
}

.success-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #e8f7ee;
  color: var(--c-success);
  display: grid;
  place-items: center;
  font-size: 28px;
  font-weight: 900;
  animation: pop 0.4s cubic-bezier(0.22, 1.4, 0.36, 1);
}

@keyframes pop {
  0% { transform: scale(0.4); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.success-detail {
  margin-top: 12px;
  padding: 10px 12px;
  background: #fafbfc;
  border: 1px solid var(--c-line-2);
  border-radius: var(--radius-sm);
  text-align: left;
}

.success-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  padding: 4px 0;
}

.success-row span { color: var(--c-muted); }

@media (min-width: 768px) {
  .page-title { font-size: 22px; }
}
</style>
