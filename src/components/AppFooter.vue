<script setup>
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()

const quickLinks = [
  { label: 'Beranda', to: { name: 'home' } },
  { label: 'Katalog Produk', to: { name: 'catalog' } },
  { label: 'Keranjang Belanja', to: { name: 'cart' } },
  { label: 'Checkout', to: { name: 'checkout' } }
]

const categoriesLink = [
  { label: 'Motor Listrik', query: 'motor-listrik' },
  { label: 'Sepeda Listrik', query: 'sepeda-listrik' },
  { label: 'Sepeda Dual Drive', query: 'sepeda-dual-drive' }
]

const helps = [
  { label: 'Cara Pemesanan', cn: '下单流程' },
  { label: 'Pengiriman & Instalasi', cn: '配送与安装' },
  { label: 'Garansi & Servis', cn: '质保售后' },
  { label: 'Hubungi Kami', cn: '联系我们' }
]

const payments = ['BCA', 'MANDIRI', 'BNI', 'BRI', 'QRIS', 'GoPay', 'OVO', 'COD']
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-main">
        <div>
          <div class="footer-brand-row">
            <span class="brand-mark">VIM</span>
            <span class="text-white fw-700">VIM MOTOR</span>
          </div>
          <p>
            Penyedia motor listrik, sepeda listrik, sepeda gunung hingga sepeda lipat untuk kebutuhan
            mobilitas masyarakat Indonesia.
          </p>
          <div class="pay-badges">
            <span v-for="p in payments" :key="p" class="pay-badge">{{ p }}</span>
          </div>
        </div>

        <div>
          <h4 class="footer-title">Navigasi</h4>
          <ul class="footer-list">
            <li v-for="l in quickLinks" :key="l.label">
              <RouterLink :to="l.to">{{ l.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Kategori</h4>
          <ul class="footer-list">
            <li v-for="c in categoriesLink" :key="c.query">
              <RouterLink :to="{ name: 'catalog', query: { kategori: c.query } }">
                {{ c.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Bantuan &amp; Kontak</h4>
          <ul class="footer-list">
            <li v-for="h in helps" :key="h.label">
              <span>{{ h.label }}</span>
              <span class="text-small" style="color: #6b7280"> · {{ h.cn }}</span>
            </li>
          </ul>
          <ul class="footer-list" style="margin-top: 10px">
            <li>📞 +62 877 8123 4704</li>
            <li>✉️ sales@vim-motor-demo.co.id</li>
            <li>📍 Jl. Rungkut Industri, Surabaya</li>
          </ul>
        </div>
      </div>

      <div class="demo-disclaimer">
        ⚠️ <strong>Demo Notice / 演示声明：</strong>
        本页面为纯前端演示样板（Demo），所有商品、价格、库存、订单均为模拟数据；
        不涉及真实交易，不接入任何支付网关与物流接口。表单提交仅在浏览器本地生成提示，
        不会产生任何实际订单或扣款。
      </div>

      <div class="footer-bottom">
        <span>© {{ year }} VIM Motor Demo Store. Seluruh harga dalam Rupiah (IDR).</span>
        <span>Front-end demo only — no real payment integration.</span>
      </div>
    </div>
  </footer>
</template>
