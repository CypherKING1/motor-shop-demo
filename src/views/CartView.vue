<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import QtyStepper from '@/components/QtyStepper.vue'
import AppDialog from '@/components/AppDialog.vue'
import { useCartStore } from '@/stores/cart'
import { toast } from '@/utils/toast'
import { formatIDR, handleImageError, assetUrl } from '@/utils/format'

const cart = useCartStore()

/** 运费规则（演示值，结算页会按配送方式重新计算） */
const FREE_SHIPPING_MIN = 20000000
const SHIPPING_FEE = 250000

const confirmClearOpen = ref(false)
const pendingRemoveId = ref(null)

const freeShipping = () => cart.subtotal >= FREE_SHIPPING_MIN

/** 距离免运费还差多少 */
function remainToFreeShipping() {
  return Math.max(FREE_SHIPPING_MIN - cart.subtotal, 0)
}

function onQtyChange(id, qty) {
  cart.setQty(id, qty)
}

function askRemove(id) {
  pendingRemoveId.value = id
}

function confirmRemove() {
  const id = pendingRemoveId.value
  if (!id) return
  const item = cart.details.find((x) => x.id === id)
  cart.remove(id)
  pendingRemoveId.value = null
  toast.success(`${item ? item.name : 'Produk'} dihapus dari keranjang`)
}

function clearCart() {
  cart.clear()
  confirmClearOpen.value = false
  toast.success('Keranjang dikosongkan')
}

/** 删除弹窗显隐（关闭时清掉待删除 id） */
function onRemoveDialogToggle(visible) {
  if (!visible) pendingRemoveId.value = null
}
</script>

<template>
  <div class="container page">
    <nav class="breadcrumb">
      <RouterLink :to="{ name: 'home' }">Beranda</RouterLink>
      <span class="sep">/</span>
      <span class="current">Keranjang Belanja</span>
    </nav>

    <!-- ============ 步骤条 ============ -->
    <div class="step-bar">
      <span class="step-item is-active">
        <span class="step-num">1</span> Keranjang
      </span>
      <span class="step-sep">──────</span>
      <span class="step-item">
        <span class="step-num">2</span> Checkout
      </span>
      <span class="step-sep">──────</span>
      <span class="step-item">
        <span class="step-num">3</span> Selesai
      </span>
    </div>

    <h1 class="page-title">Keranjang Belanja</h1>
    <p class="text-small text-muted mb-16">
      {{ cart.lineCount }} jenis produk · {{ cart.totalQty }} unit
    </p>

    <!-- ============ 空购物车 ============ -->
    <div v-if="cart.isEmpty" class="card empty">
      <div class="empty-icon">🛒</div>
      <div class="empty-title">Keranjang Anda masih kosong</div>
      <p class="text-muted text-small">
        Yuk pilih motor listrik atau sepeda listrik favorit Anda terlebih dahulu.
      </p>
      <RouterLink class="btn btn-primary btn-lg mt-16" :to="{ name: 'catalog' }">
        Mulai Belanja
      </RouterLink>
    </div>

    <!-- ============ 购物车内容 ============ -->
    <div v-else class="cart-layout">
      <!-- 左：商品列表 -->
      <div>
        <div class="cart-list">
          <div v-for="item in cart.details" :key="item.id" class="cart-item">
            <RouterLink
              class="cart-thumb"
              :to="{ name: 'product-detail', params: { id: item.id } }"
            >
              <img :src="assetUrl(item.image)" :alt="item.name" @error="handleImageError" />
            </RouterLink>

            <div class="cart-body">
              <RouterLink
                class="cart-name"
                :to="{ name: 'product-detail', params: { id: item.id } }"
              >
                {{ item.name }}
              </RouterLink>

              <div class="cart-unit">
                <span class="tag tag-gray">{{ item.series }}</span>
                <span style="margin-left: 6px">{{ formatIDR(item.price) }} / unit</span>
              </div>

              <div class="cart-controls">
                <QtyStepper
                  :model-value="item.qty"
                  :min="1"
                  :max="99"
                  @change="(v) => onQtyChange(item.id, v)"
                />
                <button class="cart-remove" type="button" @click="askRemove(item.id)">
                  🗑️ Hapus
                </button>
              </div>
            </div>

            <div class="cart-subtotal hide-mobile">
              <div class="text-small text-muted">Subtotal</div>
              <div class="price price-md">{{ formatIDR(item.subtotal) }}</div>
            </div>
          </div>
        </div>

        <!-- 移动端显示每项小计 -->
        <div class="card card-pad mt-12 hide-desktop">
          <div v-for="item in cart.details" :key="item.id" class="summary-row">
            <span class="label">{{ item.name }} × {{ item.qty }}</span>
            <span class="value">{{ formatIDR(item.subtotal) }}</span>
          </div>
        </div>

        <div class="cart-actions">
          <RouterLink class="btn btn-ghost" :to="{ name: 'catalog' }">
            ← Lanjut Belanja
          </RouterLink>
          <button class="btn btn-ghost" type="button" @click="confirmClearOpen = true">
            Kosongkan Keranjang
          </button>
        </div>

        <div class="notice notice-warn mt-12">
          <span>ℹ️</span>
          <span>
            Data keranjang disimpan di <strong>localStorage</strong> browser Anda (Pinia + 本地缓存)，
            刷新页面不会丢失；清除浏览器数据后会重置。
          </span>
        </div>
      </div>

      <!-- 右：金额汇总 -->
      <aside class="summary is-sticky">
        <div class="panel-title">Ringkasan Pesanan</div>

        <div style="padding: 12px 14px">
          <div class="summary-row">
            <span class="label">Total Harga ({{ cart.totalQty }} unit)</span>
            <span class="value">{{ formatIDR(cart.subtotal) }}</span>
          </div>

          <div v-if="cart.totalSaving > 0" class="summary-row">
            <span class="label">Total Diskon</span>
            <span class="value text-brand">-{{ formatIDR(cart.totalSaving) }}</span>
          </div>

          <div class="summary-row">
            <span class="label">Ongkos Kirim</span>
            <span class="value">
              <template v-if="freeShipping()">
                <span class="text-brand fw-700">GRATIS</span>
              </template>
              <template v-else>{{ formatIDR(SHIPPING_FEE) }}</template>
            </span>
          </div>

          <div class="summary-total">
            <span class="label">Total Bayar</span>
            <span class="value">
              {{ formatIDR(cart.subtotal + (freeShipping() ? 0 : SHIPPING_FEE)) }}
            </span>
          </div>

          <div v-if="cart.totalSaving > 0" class="saving-pill">
            🎉 Anda hemat {{ formatIDR(cart.totalSaving) }}
          </div>

          <div v-if="!freeShipping()" class="notice notice-info mt-12">
            <span>🚚</span>
            <span>
              Belanja {{ formatIDR(remainToFreeShipping()) }} lagi untuk <strong>Gratis Ongkir</strong>.
            </span>
          </div>

          <RouterLink class="btn btn-primary btn-lg btn-block cart-checkout-btn" :to="{ name: 'checkout' }">
            Lanjut ke Checkout →
          </RouterLink>

          <p class="text-small text-muted mt-12" style="text-align: center">
            🔒 Transaksi pada demo ini hanya simulasi
          </p>
        </div>
      </aside>
    </div>

    <!-- ============ 删除确认弹窗 ============ -->
    <AppDialog
      :model-value="pendingRemoveId !== null"
      title="Hapus produk ini?"
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      @update:model-value="onRemoveDialogToggle"
      @confirm="confirmRemove"
      @cancel="pendingRemoveId = null"
    >
      Produk akan dihapus dari keranjang belanja Anda.
    </AppDialog>

    <!-- ============ 清空购物车弹窗 ============ -->
    <AppDialog
      v-model="confirmClearOpen"
      title="Kosongkan keranjang?"
      confirm-text="Ya, Kosongkan"
      cancel-text="Batal"
      @confirm="clearCart"
    >
      Semua produk di keranjang akan dihapus. Tindakan ini tidak dapat dibatalkan.
    </AppDialog>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 19px;
  font-weight: 800;
}

.cart-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.cart-actions .btn { flex: 1 1 auto; }

@media (min-width: 768px) {
  .page-title { font-size: 22px; }
  .cart-actions .btn { flex: 0 0 auto; }
}
</style>
