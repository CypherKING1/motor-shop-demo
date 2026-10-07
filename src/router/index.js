import { createRouter, createWebHistory } from 'vue-router'

/**
 * 5 个页面（全部懒加载，首屏更快）
 * 1. /            首页（商品列表）
 * 2. /katalog     全部商品（分类 / 系列筛选 + 排序）
 * 3. /produk/:id  商品详情
 * 4. /keranjang   购物车
 * 5. /checkout    结算下单
 *
 * 除首页外全部访问 .html 时刷新会 404，部署时需配置 SPA fallback（见 README）
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'VIM Motor | Motor Listrik & Sepeda Listrik Indonesia' }
  },
  {
    path: '/katalog',
    name: 'catalog',
    component: () => import('@/views/CatalogView.vue'),
    meta: { title: 'Katalog Produk | VIM Motor' }
  },
  {
    path: '/produk/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: 'Detail Produk | VIM Motor' }
  },
  {
    path: '/keranjang',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: 'Keranjang Belanja | VIM Motor' }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Checkout | VIM Motor' }
  },
  // 兜底：未匹配的地址回首页
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.afterEach((to) => {
  if (to.meta?.title) document.title = to.meta.title
})

export default router
