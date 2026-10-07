# VIM Motor — 摩托车 / 电动车电商 Demo（纯前端）

一个用于**商户 Demo 展示（海外支付审核）**的纯前端电商样板项目。技术栈 **Vite + Vue 3 + JavaScript（无 TS）+ vue-router + Pinia**，UI 为简约外贸电商风格（布局参考淘宝），移动端自适应，印尼语 + 印尼盾（IDR）标价。

> **⚠️ 演示声明 / Demo Notice**
> 本项目**没有后端、没有数据库、不接入任何支付网关与物流接口**。
> 所有商品、价格、库存、订单号、支付方式均为本地模拟数据，表单提交只在浏览器内弹出提示，
> **不会产生任何真实订单或扣款**。整套代码仅用于展示页面流程与视觉效果。

---

## 一、技术栈与版本

| 依赖 | 实际安装版本 | 说明 |
|---|---|---|
| vue | 3.5.43 | 组合式 API（`<script setup>`） |
| vue-router | 4.6.4 | 5 个页面跳转，history 模式 |
| pinia | 2.3.1 | 购物车状态 + localStorage 缓存 |
| vite | 6.4.4 | 构建工具 |
| @vitejs/plugin-vue | 5.2.4 | SFC 编译 |

**未使用任何第三方 UI 库**，全部为手写 CSS（约 1600 行，含设计变量与响应式断点）。如需 Element Plus 见文末「扩展」。

---

## 二、初始化命令（从零搭建）

```bash
# 1. 创建项目（选择 Vue + JavaScript，不要选 TypeScript）
npm create vite@latest motor-shop-demo -- --template vue

# 2. 进入目录
cd motor-shop-demo

# 3. 安装依赖（国内网络建议加镜像）
npm install
npm install vue-router pinia

# 国内镜像用法：
# npm install --registry=https://registry.npmmirror.com

# 4. 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 5. 生产构建 + 本地预览
npm run build
npm run preview
```

> **本机安装小坑（已验证）**：如果 `npm install` 报 esbuild 的
> `spawnSync ... EBUSY`（postinstall 校验时 spawn node.exe 被拦），
> 用 `npm install --ignore-scripts` 即可，esbuild 的平台二进制包
> （`@esbuild/win32-x64`）照常安装，构建与开发都不受影响。

然后把本仓库的 `src/`、`public/`、`index.html`、`vite.config.js` 覆盖过去即可（`package.json` 的依赖已对齐）。

---

## 三、目录结构

```
motor-shop-demo/
├── index.html                      # 入口 HTML（lang="id"）
├── package.json
├── vite.config.js                  # @ 别名、端口、base 配置
├── .gitignore
├── README.md
│
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── placeholder-motor.svg   # 统一图片占位图（自动回退用）
│       ├── motors/                 # ★ 摩托车照片放这里（见该目录 README.txt）
│       └── banner/                 # ★ 首页 Hero 轮播图放这里
│
├── screenshots/                    # 各页面实拍截图（移动端 + 桌面端）
│
└── src/
    ├── main.js                     # 挂载 app / pinia / router / 全局样式
    ├── App.vue                     # 布局骨架：Header + RouterView + Footer + Toaster
    │
    ├── router/
    │   └── index.js                # 5 个路由 + 滚动行为 + 标题设置
    │
    ├── stores/
    │   └── cart.js                 # ★ Pinia 购物车（含 localStorage 持久化与数据校验）
    │
    ├── data/
    │   └── products.js             # ★ 10 款商品数据（名称/价格 IDR/参数/图片路径）
    │
    ├── utils/
    │   ├── format.js               # 印尼盾格式化、图片回退、订单号生成、折扣计算
    │   └── toast.js                # 极简 Toast（无第三方库）
    │
    ├── assets/styles/
    │   └── main.css                # 全局样式与响应式（移动端优先）
    │
    ├── components/
    │   ├── AppHeader.vue           # 顶部信息条 + Logo + 搜索 + 购物车角标 + 导航 + 侧边抽屉
    │   ├── AppFooter.vue           # 页脚、支付方式徽标、Demo 免责声明
    │   ├── ProductCard.vue         # 商品卡片（图片/名称/价格/加购）
    │   ├── QtyStepper.vue          # 数量步进器
    │   ├── AppDialog.vue           # 通用弹窗（Teleport，下单成功/删除确认）
    │   └── AppToaster.vue          # Toast 容器
    │
    └── views/                      # ★ 5 个页面
        ├── HomeView.vue            # 1. 首页：Hero 轮播 + 服务承诺 + 分类入口 + 商品列表 + 评价
        ├── CatalogView.vue         # 2. 全部商品：分类/系列/价格筛选 + 排序 + 关键词
        ├── ProductDetailView.vue   # 3. 商品详情：大图 + 参数 + 数量 + 加购 + 选项卡 + 推荐
        ├── CartView.vue            # 4. 购物车：改数量/删除/清空 + 自动算总价 + 去结算
        └── CheckoutView.vue        # 5. 结算：收货表单校验 + 配送/支付方式 + 订单清单 + 提交弹窗
```

---

## 四、页面流程

```
首页 /                    商品列表（Hero 轮播、分类、商品卡片）
  │
  ├── 加入购物车 ─────────────────────────┐
  │                                       │
  └─→ 商品详情 /produk/:id                 │
        │  大图 / 参数 / 单价 / 加购         │
        └── 加入购物车 ───────────────────┤
                                          ▼
                              购物车 /keranjang
                    改数量 · 删除 · 清空 · 自动算总价（含优惠与运费）
                                          │
                                          ▼
                              结算 /checkout
                  收货人/地址表单（带校验）· 配送方式 · 支付方式
                             订单清单 + 合计金额
                                          │
                            「Buat Pesanan」 → 弹窗【订单提交成功】
                              （显示订单号/支付方式/金额，纯本地模拟）
```

另外 `/katalog` 是独立的全部商品页（5 个路由页面之一），支持分类、系列、价格区间、排序与关键词筛选。

路由表：

| 路径 | 名称 | 页面 |
|---|---|---|
| `/` | home | 首页商品列表 |
| `/katalog` | catalog | 全部商品（筛选/排序） |
| `/produk/:id` | product-detail | 商品详情 |
| `/keranjang` | cart | 购物车 |
| `/checkout` | checkout | 结算下单 |

---

## 五、替换摩托车图片（不用改代码）

商品图统一放在 `public/images/motors/`，**现已放入 10 款车型的真实产品图**
（统一处理为 800 × 600 白底 JPEG，单张 15~50KB，全部来自参考站的公开产品页）。

命名规则：主图 `<slug>.jpg`，详情页多图 `<slug>-2.jpg` / `-3` / `-4`。

```
s-100-pegasus.jpg        s-200-poni.jpg          s-300-pallosa.jpg
s-500-unicorn.jpg        myatu-flip.jpg          myatu-mountain-bike.jpg
sl-300-gentayu.jpg       sl-600-bujana-plus.jpg  m-500.jpg
garuda-evkuda.jpg        （+ 各自的 -2 / -3 / -4 详情页缩略图）
```

- **换成自己的照片：直接覆盖同名文件即可，不用改任何代码。**
- 文件**不存在时自动回退**到 `public/images/placeholder-motor.svg` 占位图，不会出现裂图。
- 推荐尺寸 **800 × 600 px（4:3）**；支持 jpg / webp / png，换格式要同步改 `products.js` 里的后缀。
- 详情页缩略图由 `products.js` 里每个商品的 `gallery` 数组控制，数组第一张即默认大图。
- 首页 Hero 图放 `public/images/banner/hero-1.jpg`、`hero-2.jpg`、`hero-3.jpg`（1000 × 750）。

> ⚠️ 图片取自参考站点 `victorindotamamotor.com` 的公开产品页，仅用于本 Demo 的页面演示。
> 正式商用前请自行确认图片使用授权，或替换为你们自己的产品实拍图。

---

## 六、部署说明

构建产物为纯静态文件（`npm run build` → `dist/`），可部署到任意静态托管。

因为使用了 history 路由，**非首页直接访问/刷新需要 SPA 回退到 index.html**。

### 1) Vercel / Netlify（最省事）

- 构建命令 `npm run build`，输出目录 `dist`。
- Netlify 在项目根目录加 `public/_redirects`：

  ```
  /*  /index.html  200
  ```

- Vercel 加 `vercel.json`：

  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

### 2) Nginx

```nginx
server {
    listen 80;
    server_name demo.example.com;
    root /var/www/motor-shop-demo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;      # SPA 回退，必须有
    }

    location ~* \.(js|css|png|jpg|jpeg|svg|webp|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3) GitHub Pages（已配好，推送即自动部署）

项目里已经准备好了完整配置，**不需要手动改 base、也不需要手动推 dist**：

| 文件 | 作用 |
|---|---|
| `.github/workflows/deploy.yml` | 推送 main 分支 → 自动构建 → 自动部署到 Pages |
| `vite.config.js` 的 `base` | **自动识别**：本地为 `/`，GitHub Actions 里自动变成 `/<仓库名>/`，仓库改名也不用管 |
| `public/404.html` + `index.html` 里的还原脚本 | SPA 深链接兜底，直接打开 / 刷新 `/keranjang` 这类地址不会 404 |

**部署三步：**

1. 在 GitHub 网页建一个空仓库（**不要**勾 "Add a README"）
2. 本地推送（先开代理）：
   ```powershell
   git commit -m "feat: 摩托车电商 Demo"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git -c http.version=HTTP/1.1 push -u origin main
   ```
3. 仓库 → **Settings → Pages → Source 选 `GitHub Actions`**

之后每次 `git push` 都会自动重新构建并更新线上版本。同事/审核方拿到的地址是：

```
https://<你的用户名>.github.io/<仓库名>/
```

> 说明：
> - 如果用 **私有仓库**，Pages 站点本身**仍然是公开网址**（免费账号也支持私有仓库开 Pages）。
>   若 Settings → Pages 里没有 "GitHub Actions" 选项或提示需要升级，说明当前账号计划不支持，
>   把仓库改成公开、或改用上面 Nginx / Netlify 方式即可。
> - `base` 是在构建时确定的，所以**必须让 Actions 去构建**（不要自己本地 `npm run build` 后推 dist），
>   否则前缀会不对、页面白屏。

### 4) 本地打包给别人看

```bash
npm run build
npx serve dist        # 或任意静态服务器
```

---

## 七、常见修改点

| 想改什么 | 改哪里 |
|---|---|
| 品牌名 / 电话 / 地址 / 邮箱 | `src/components/AppHeader.vue`、`AppFooter.vue` |
| 商品名称、价格（IDR）、参数 | `src/data/products.js`（`price` / `oldPrice` 直接写数字，不用写符号） |
| 分类 / 系列筛选选项 | `src/data/products.js` 的 `categories`、`seriesList` |
| 运费规则、免运费门槛 | `src/views/CartView.vue`、`CheckoutView.vue` 顶部的 `FREE_SHIPPING_MIN`、`SHIPPING_FEE` |
| 配送方式 / 支付方式选项 | `CheckoutView.vue` 的 `shippingMethods`、`paymentMethods` |
| 可选城市列表 | `CheckoutView.vue` 的 `cities` |
| 送货表单校验规则 | `CheckoutView.vue` 的 `rules` |
| 首页轮播文案 | `HomeView.vue` 的 `slides` 数组 |
| 主题色 | `src/assets/styles/main.css` 顶部 `:root` 里的 `--c-brand` 等变量 |
| 下单成功弹窗文案 | `CheckoutView.vue` 里的 `<AppDialog>` 部分 |

### 扩展：如果确实想用 Element Plus

```bash
npm install element-plus
```

```js
// src/main.js
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)
```

本项目的弹窗（`AppDialog.vue`）、Toast（`utils/toast.js`）都是零依赖实现，
换成 `ElDialog` / `ElMessage` 也可以，但当前版本 **不引入任何 UI 库**，加载更轻。

---

## 八、UI 与响应式

- **风格**：浅灰底 + 白卡片 + 红色价格与主按钮，参考印尼电动摩托车品牌官网
  （深色顶栏 / Hero 深色渐变 / 系列标签 / SWAP 电池卖点），布局参考淘宝。
- **断点**：移动端优先，`768px`（平板）与 `1024px`（桌面）两档。
  - 商品网格：2 列 → 3 列 → 4 列
  - 购物车 / 结算：单列 → 双列（右侧金额卡片 sticky 吸顶）
  - 商品详情：移动端底部固定购买栏，桌面端隐藏
  - 导航：移动端横向滑动 + 侧边抽屉，桌面端一行平铺
- **兼容**：iOS 安全区（`env(safe-area-inset-bottom)`）、`aspect-ratio`、
  `backdrop-filter`、CSS 变量，主流现代浏览器均可正常显示。

---

## 九、数据说明

- 购物车状态由 Pinia 管理，**写入 localStorage**（key `vim_motor_cart_v1`），
  刷新不丢失；读取时会校验商品是否仍存在、数量是否合法，脏数据自动剔除。
- 只需存 `{ id, qty }`，商品信息实时从 `products.js` 读取，改价格不用清缓存。
- 订单号格式 `VIM-YYYYMMDD-XXXX`，由 `src/utils/format.js` 的 `generateOrderNo()` 本地生成。

---

## 十、演示边界（给审核方看）

| 说明 | 状态 |
|---|---|
| 页面流程（列表 → 详情 → 加购 → 购物车 → 结算 → 提交） | ✅ 完整可走通 |
| 数量增减、删除、总价实时计算 | ✅ 真实前端逻辑 |
| 表单校验（手机号、邮编、必填项） | ✅ 真实前端逻辑 |
| 仓储、库存扣减、订单落库 | ❌ 无（本地模拟） |
| 用户登录 / 注册 | ❌ 无 |
| 支付网关（转账 / VA / QRIS / 卡 / COD） | ❌ 仅页面展示，点击不发起任何请求 |
| 物流对接 | ❌ 无 |
| 网络请求 | ❌ 全站零 `fetch` / `axios` 调用，纯前端 |

---

## 十一、已验证项（本次交付前实测）

- `npm run build` 生产构建通过：52 个模块，零报错、零警告。
- Pinia 购物车逻辑自检 **16 / 16 通过**：加购累加、数量上下限、减到 0 自动删除、
  localStorage 读写、脏数据剔除、总价/优惠/折扣计算。
- 5 个页面在真实浏览器（Chromium 内核）中逐一渲染通过，关键内容与金额格式（`Rp 24.900.000`）均正确。
- 移动端 **390px** 视口下无横向溢出，布局与字号正常。
- **导航高亮唯一性**：`/`、`/katalog`、`/katalog?kategori=…`、`/produk/:id`、`/keranjang`
  每个路由下导航条都**只有一个** `is-active`，且是正确的那一个。
- **图片全部为真实产品图**：10 款车型共 31 张（含详情页多图），页面渲染时占位图回退次数 **0**，
  全部 `HTTP 200` + `image/jpeg`。
- **GitHub Pages 子路径部署实测通过**：本地起了一个模拟 GitHub Pages 行为的静态服务
  （站点挂在 `/motor-shop-demo/` 下、未知路径返回 `404.html`），验证
  首页、`/keranjang`、`/produk/10`、`/checkout` 四个地址**直接打开都能正常渲染**
  （深链接靠 `404.html` + `index.html` 里的还原脚本），资源与图片全部走对前缀，占位图回退 0 次。
- `screenshots/` 内为本机实测截图（移动端 390px + 桌面端 1440px）。
