<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { formatIDR, handleImageError, discountPercent, assetUrl } from '@/utils/format'

const props = defineProps({
  product: { type: Object, required: true }
})

defineEmits(['add'])

const hasDiscount = computed(() => props.product.oldPrice > props.product.price)
const discount = computed(() => discountPercent(props.product.price, props.product.oldPrice))
</script>

<template>
  <article class="pcard">
    <RouterLink class="pcard-media" :to="{ name: 'product-detail', params: { id: product.id } }">
      <img
        :src="assetUrl(product.image)"
        :alt="product.name"
        loading="lazy"
        @error="handleImageError"
      />
      <span v-if="product.badge" class="tag tag-dark pcard-badge">{{ product.badge }}</span>
      <span v-if="hasDiscount" class="pcard-save">-{{ discount }}%</span>
    </RouterLink>

    <div class="pcard-body">
      <span class="pcard-series">{{ product.series }}</span>

      <RouterLink
        class="pcard-name"
        :to="{ name: 'product-detail', params: { id: product.id } }"
      >
        {{ product.name }}
      </RouterLink>

      <div class="pcard-price-row">
        <span class="price price-md">{{ formatIDR(product.price) }}</span>
        <span v-if="hasDiscount" class="price-old">{{ formatIDR(product.oldPrice) }}</span>
      </div>

      <div class="pcard-meta">
        <span>⭐ {{ product.rating }}</span>
        <span>{{ product.sold }} terjual</span>
        <span v-if="product.stock > 0" class="pcard-stock">Stok ada</span>
      </div>

      <div class="pcard-actions">
        <button class="btn btn-outline btn-sm" type="button" @click="$emit('add', product)">
          + Keranjang
        </button>
        <RouterLink
          class="btn btn-primary btn-sm"
          :to="{ name: 'product-detail', params: { id: product.id } }"
        >
          Lihat
        </RouterLink>
      </div>
    </div>
  </article>
</template>
