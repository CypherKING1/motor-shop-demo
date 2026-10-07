/**
 * 商品数据（纯演示数据，价格按印尼市场电动两轮车行情标价，单位：印尼盾 IDR）
 *
 * 图片目录：public/images/motors/
 * 把你自己的摩托车照片按下面的 image 字段文件名放进去即可，不用改代码；
 * 文件不存在时会自动回退到 /images/placeholder-motor.svg 占位图。
 */

export const categories = [
  { id: 'semua', label: 'Semua Produk', labelCn: '全部商品' },
  { id: 'motor-listrik', label: 'Motor Listrik', labelCn: '电动摩托' },
  { id: 'sepeda-listrik', label: 'Sepeda Listrik', labelCn: '电动自行车' },
  { id: 'sepeda-dual-drive', label: 'Sepeda Dual Drive', labelCn: '双驱电助力' }
]

export const seriesList = [
  'S-Series',
  'SL-Series',
  'M-Series',
  'Myatu Series',
  'Swap Series',
  'Garuda Series'
]

export const products = [
  {
    id: 1,
    slug: 's-100-pegasus',
    name: 'S-100 Pegasus',
    series: 'S-Series',
    category: 'sepeda-listrik',
    price: 6850000,
    oldPrice: 7500000,
    image: '/images/motors/s-100-pegasus.jpg',
    gallery: [
      '/images/motors/s-100-pegasus.jpg',
      '/images/motors/s-100-pegasus-2.jpg',
      '/images/motors/s-100-pegasus-3.jpg',
      '/images/motors/s-100-pegasus-4.jpg'
    ],
    badge: 'Terlaris',
    rating: 4.8,
    sold: 1240,
    stock: 32,
    shortDesc:
      'Sepeda listrik ringan untuk mobilitas harian di dalam kota. Nyaman, hemat, dan mudah dikendarai siapa saja.',
    description:
      'S-100 Pegasus adalah sepeda listrik andalan VIM Motor untuk mobilitas urban. Rangka baja ringan yang kokoh, jok lebar dan empuk, serta sistem suspensi ganda membuat perjalanan harian terasa nyaman. Cocok untuk antar jemput anak, belanja ke pasar, maupun perjalanan pendek ke kantor. Baterai SLA 48V12A yang mudah diganti membuat biaya operasional jauh lebih murah dibanding kendaraan berbahan bakar.',
    specs: [
      { label: 'Motor Power', value: '500W' },
      { label: 'Battery', value: 'SLA 48V12A' },
      { label: 'Jarak Tempuh', value: '± 45 KM' },
      { label: 'Kecepatan Max', value: '~40 KM/Jam' },
      { label: 'Dimensi', value: '1470 x 550 x 1100 mm' },
      { label: 'Ban', value: '10" x 2.5" Tubeless' },
      { label: 'Berat Maksimal', value: '120 KG' },
      { label: 'Waktu Charging', value: '6 - 8 Jam' }
    ],
    features: ['Rangka baja ringan anti karat', 'Jok lebar dan nyaman', 'Suspensi ganda depan belakang', 'Lampu LED hemat daya']
  },
  {
    id: 2,
    slug: 's-200-poni',
    name: 'S-200 Poni',
    series: 'S-Series',
    category: 'sepeda-listrik',
    price: 7250000,
    oldPrice: 7990000,
    image: '/images/motors/s-200-poni.jpg',
    gallery: [
      '/images/motors/s-200-poni.jpg',
      '/images/motors/s-200-poni-2.jpg',
      '/images/motors/s-200-poni-3.jpg',
      '/images/motors/s-200-poni-4.jpg'
    ],
    badge: '',
    rating: 4.7,
    sold: 986,
    stock: 25,
    shortDesc:
      'Model kompak dengan desain manis, sangat pas untuk pengendara pemula dan area perumahan yang padat.',
    description:
      'S-200 Poni hadir dengan dimensi kompak namun tetap nyaman. Desainnya manis dan cocok untuk semua kalangan, termasuk pengendara pemula. Dilengkapi mode kecepatan ganda sehingga mudah disesuaikan dengan kondisi jalan perumahan, gang sempit, maupun jalan protokol. Sistem pengereman depan-belakang yang responsif menjaga keamanan berkendara.',
    specs: [
      { label: 'Motor Power', value: '500W' },
      { label: 'Battery', value: 'SLA 48V12A' },
      { label: 'Jarak Tempuh', value: '± 45 KM' },
      { label: 'Kecepatan Max', value: '~40 KM/Jam' },
      { label: 'Dimensi', value: '1470 x 550 x 1100 mm' },
      { label: 'Ban', value: '10" x 2.5" Tubeless' },
      { label: 'Berat Maksimal', value: '110 KG' },
      { label: 'Waktu Charging', value: '6 - 8 Jam' }
    ],
    features: ['Mode kecepatan ganda', 'Desain kompak & manis', 'Rem depan belakang responsif', 'Panel instrumen sederhana']
  },
  {
    id: 3,
    slug: 's-300-pallosa',
    name: 'S-300 Pallosa',
    series: 'S-Series',
    category: 'sepeda-listrik',
    price: 8450000,
    oldPrice: 9200000,
    image: '/images/motors/s-300-pallosa.jpg',
    gallery: [
      '/images/motors/s-300-pallosa.jpg',
      '/images/motors/s-300-pallosa-2.jpg',
      '/images/motors/s-300-pallosa-3.jpg',
      '/images/motors/s-300-pallosa-4.jpg'
    ],
    badge: 'Promo',
    rating: 4.8,
    sold: 742,
    stock: 18,
    shortDesc:
      'Baterai kapasitas besar SLA 48V20A dengan jarak tempuh lebih jauh, cocok untuk perjalanan harian yang panjang.',
    description:
      'S-300 Pallosa adalah versi jarak jauh dari seri S. Menggunakan baterai SLA 48V20A dengan kapasitas lebih besar sehingga mampu menempuh perjalanan lebih jauh dalam sekali pengisian. Dilengkapi bagasi belakang yang lapang untuk membawa barang belanjaan atau perlengkapan kerja. Cocok bagi Anda yang mobilitasnya padat setiap hari.',
    specs: [
      { label: 'Motor Power', value: '500W' },
      { label: 'Battery', value: 'SLA 48V20A' },
      { label: 'Jarak Tempuh', value: '± 70 KM' },
      { label: 'Kecepatan Max', value: '~40 KM/Jam' },
      { label: 'Dimensi', value: '1470 x 550 x 1100 mm' },
      { label: 'Ban', value: '10" x 2.5" Tubeless' },
      { label: 'Berat Maksimal', value: '130 KG' },
      { label: 'Waktu Charging', value: '8 - 10 Jam' }
    ],
    features: ['Baterai kapasitas besar', 'Bagasi belakang lapang', 'Jarak tempuh hingga 70 KM', 'Gratis helm & jas hujan']
  },
  {
    id: 4,
    slug: 's-500-unicorn',
    name: 'S-500 Unicorn',
    series: 'S-Series',
    category: 'sepeda-listrik',
    price: 9150000,
    oldPrice: 9950000,
    image: '/images/motors/s-500-unicorn.jpg',
    gallery: [
      '/images/motors/s-500-unicorn.jpg',
      '/images/motors/s-500-unicorn-2.jpg',
      '/images/motors/s-500-unicorn-3.jpg'
    ],
    badge: '',
    rating: 4.9,
    sold: 1568,
    stock: 41,
    shortDesc:
      'Desain timeless dan kuat dengan panel instrumen interaktif serta fitur keamanan yang lengkap.',
    description:
      'S-500 Unicorn mengusung desain timeless yang kuat dan modern. Panel instrumen interaktif dan tahan air memudahkan Anda memantau kecepatan, daya baterai, serta mode berkendara. Dilengkapi fitur keamanan canggih seperti alarm anti-maling dan kunci remote ganda, menjadikannya pilihan favorit keluarga Indonesia.',
    specs: [
      { label: 'Motor Power', value: '500W' },
      { label: 'Battery', value: 'SLA 48V12A' },
      { label: 'Jarak Tempuh', value: '± 50 KM' },
      { label: 'Kecepatan Max', value: '~40 KM/Jam' },
      { label: 'Dimensi', value: '1470 x 550 x 1100 mm' },
      { label: 'Ban', value: '10" x 2.5" Tubeless' },
      { label: 'Berat Maksimal', value: '130 KG' },
      { label: 'Waktu Charging', value: '6 - 8 Jam' }
    ],
    features: ['Desain timeless dan kuat', 'Fitur keamanan canggih', 'Panel instrumen interaktif & tahan air', 'Alarm anti-maling']
  },
  {
    id: 5,
    slug: 'myatu-flip',
    name: 'Myatu Flip',
    series: 'Myatu Series',
    category: 'sepeda-dual-drive',
    price: 12750000,
    oldPrice: 13900000,
    image: '/images/motors/myatu-flip.jpg',
    gallery: [
      '/images/motors/myatu-flip.jpg',
      '/images/motors/myatu-flip-2.jpg',
      '/images/motors/myatu-flip-3.jpg',
      '/images/motors/myatu-flip-4.jpg'
    ],
    badge: 'Baru',
    rating: 4.7,
    sold: 318,
    stock: 12,
    shortDesc:
      'Sepeda lipat dual drive system — ringkas dibawa di bagasi mobil, bertenaga di tanjakan.',
    description:
      'Myatu Flip menggabungkan kepraktisan sepeda lipat dengan tenaga dual drive system. Bodi dapat dilipat dalam hitungan detik sehingga mudah dibawa di bagasi mobil, lift kantor, maupun transportasi umum. Sistem dual drive memberikan tenaga tambahan saat menanjak. Perpindahan gigi yang mudah dan posisi duduk ergonomis membuat perjalanan jauh tetap menyenangkan.',
    specs: [
      { label: 'Motor Power', value: 'Dual 350W x 350W' },
      { label: 'Battery', value: 'Lithium 48V20A' },
      { label: 'Jarak Tempuh', value: '± 90 KM' },
      { label: 'Kecepatan Max', value: '~45 KM/Jam' },
      { label: 'Dimensi', value: '1750 x 600 x 1050 mm (lipat: 850 mm)' },
      { label: 'Ban', value: '20" x 2.0"' },
      { label: 'Berat Maksimal', value: '120 KG' },
      { label: 'Waktu Charging', value: '5 - 7 Jam' }
    ],
    features: ['Dual drive system', 'Desain ergonomis', 'Perpindahan gigi lebih mudah', 'Bodi dapat dilipat']
  },
  {
    id: 6,
    slug: 'myatu-mountain-bike',
    name: 'Myatu Mountain Bike',
    series: 'Myatu Series',
    category: 'sepeda-listrik',
    price: 11900000,
    oldPrice: 0,
    image: '/images/motors/myatu-mountain-bike.jpg',
    badge: '',
    rating: 4.6,
    sold: 274,
    stock: 15,
    shortDesc:
      'Sepeda gunung elektrik dengan baterai lithium dan suspensi depan untuk medan berbukit.',
    description:
      'Myatu Mountain Bike dirancang untuk Anda yang ingin menjelajah medan berbukit dan jalanan tidak rata. Suspensi depan mampu meredam guncangan, sementara ban lebar berpola agresif menjaga traksi. Baterai lithium yang ringan dan awet membuat perjalanan jauh tetap efisien.',
    specs: [
      { label: 'Motor Power', value: '500W' },
      { label: 'Battery', value: 'Lithium 48V15A' },
      { label: 'Jarak Tempuh', value: '± 80 KM' },
      { label: 'Kecepatan Max', value: '~45 KM/Jam' },
      { label: 'Dimensi', value: '1780 x 620 x 1080 mm' },
      { label: 'Ban', value: '26" x 1.95"' },
      { label: 'Berat Maksimal', value: '130 KG' },
      { label: 'Waktu Charging', value: '4 - 6 Jam' }
    ],
    features: ['Suspensi depan hidrolik', 'Baterai lithium ringan', 'Ban off-road traksi tinggi', 'Gear 7 speed Shimano']
  },
  {
    id: 7,
    slug: 'sl-300-gentayu',
    name: 'SL-300 Gentayu',
    series: 'SL-Series',
    category: 'motor-listrik',
    price: 15900000,
    oldPrice: 17500000,
    image: '/images/motors/sl-300-gentayu.jpg',
    badge: 'Promo',
    rating: 4.8,
    sold: 512,
    stock: 20,
    shortDesc:
      'Motor listrik dengan kapasitas baterai besar, fitur USB, dan sistem suspensi super nyaman.',
    description:
      'SL-300 Gentayu adalah motor listrik yang dirancang untuk kenyamanan berkendara di jalanan kota Indonesia. Kapasitas baterai besar memastikan Anda tidak perlu sering mengisi daya. Dilengkapi port USB untuk mengisi ponsel, serta sistem suspensi yang sangat nyaman melewati jalan berlubang.',
    specs: [
      { label: 'Motor Power', value: '1000W' },
      { label: 'Battery', value: 'Lithium 60V24A' },
      { label: 'Jarak Tempuh', value: '± 120 KM' },
      { label: 'Kecepatan Max', value: '~65 KM/Jam' },
      { label: 'Dimensi', value: '1850 x 680 x 1120 mm' },
      { label: 'Ban', value: '12" Tubeless' },
      { label: 'Berat Maksimal', value: '180 KG' },
      { label: 'Waktu Charging', value: '5 - 7 Jam' }
    ],
    features: ['Kapasitas baterai besar', 'Fitur port USB', 'Sistem suspensi super nyaman', 'Bagasi bawah jok lapang']
  },
  {
    id: 8,
    slug: 'sl-600-bujana-plus',
    name: 'SL-600 Bujana Plus',
    series: 'Swap Series',
    category: 'motor-listrik',
    price: 21500000,
    oldPrice: 23900000,
    image: '/images/motors/sl-600-bujana-plus.jpg',
    gallery: [
      '/images/motors/sl-600-bujana-plus.jpg',
      '/images/motors/sl-600-bujana-plus-2.jpg',
      '/images/motors/sl-600-bujana-plus-3.jpg'
    ],
    badge: 'Swap Battery',
    rating: 4.9,
    sold: 386,
    stock: 9,
    shortDesc:
      'Seri SWAP — baterai bisa ditukar di gerai VIM, tanpa menunggu charging lama. Dilengkapi GPS.',
    description:
      'SL-600 Bujana Plus adalah bagian dari SWAP SERIES, solusi baterai yang bisa ditukar. Cukup datang ke gerai penukaran VIM terdekat dan tukar baterai kosong dengan yang penuh — tanpa perlu menunggu berjam-jam mengisi daya. Dilengkapi GPS tracker dan material berkualitas tinggi yang tahan lama.',
    specs: [
      { label: 'Motor Power', value: '1200W' },
      { label: 'Battery', value: 'Swap Lithium 60V30A' },
      { label: 'Jarak Tempuh', value: '± 100 KM / baterai' },
      { label: 'Kecepatan Max', value: '~70 KM/Jam' },
      { label: 'Dimensi', value: '1880 x 690 x 1130 mm' },
      { label: 'Ban', value: '12" Tubeless' },
      { label: 'Berat Maksimal', value: '180 KG' },
      { label: 'Waktu Charging', value: 'Tukar baterai (tanpa tunggu)' }
    ],
    features: ['Fleksibilitas penggunaan', 'Dilengkapi dengan GPS', 'Material berkualitas', 'Baterai bisa ditukar (SWAP)']
  },
  {
    id: 9,
    slug: 'm-500',
    name: 'M-500',
    series: 'M-Series',
    category: 'motor-listrik',
    price: 24900000,
    oldPrice: 26400000,
    image: '/images/motors/m-500.jpg',
    gallery: [
      '/images/motors/m-500.jpg',
      '/images/motors/m-500-2.jpg',
      '/images/motors/m-500-3.jpg'
    ],
    badge: '',
    rating: 4.7,
    sold: 421,
    stock: 14,
    shortDesc:
      'Teknologi baterai lithium, fitur keselamatan canggih, dan daya angkut maksimal untuk usaha Anda.',
    description:
      'M-500 mengandalkan teknologi baterai lithium terbaru yang lebih ringan dan tahan lama. Fitur keselamatan canggih meliputi rem cakram depan-belakang, lampu utama LED proyeksi, serta indikator baterai digital. Daya angkut maksimal membuatnya juga cocok untuk kebutuhan usaha kecil seperti antar barang atau ojek online.',
    specs: [
      { label: 'Motor Power', value: '1500W' },
      { label: 'Battery', value: 'Lithium 72V30A' },
      { label: 'Jarak Tempuh', value: '± 130 KM' },
      { label: 'Kecepatan Max', value: '~80 KM/Jam' },
      { label: 'Dimensi', value: '1920 x 710 x 1150 mm' },
      { label: 'Ban', value: '12" Tubeless' },
      { label: 'Berat Maksimal', value: '200 KG' },
      { label: 'Waktu Charging', value: '5 - 6 Jam' }
    ],
    features: ['Teknologi baterai lithium', 'Fitur keamanan canggih', 'Daya angkut maksimal', 'Rem cakram depan belakang']
  },
  {
    id: 10,
    slug: 'garuda-evkuda',
    name: 'Garuda - EVKuda',
    series: 'Garuda Series',
    category: 'motor-listrik',
    price: 27900000,
    oldPrice: 29900000,
    image: '/images/motors/garuda-evkuda.jpg',
    gallery: [
      '/images/motors/garuda-evkuda.jpg',
      '/images/motors/garuda-evkuda-2.jpg',
      '/images/motors/garuda-evkuda-3.jpg',
      '/images/motors/garuda-evkuda-4.jpg'
    ],
    badge: 'Flagship',
    rating: 5.0,
    sold: 208,
    stock: 7,
    shortDesc:
      'Produk unggulan VIM untuk segala kebutuhan — performa tertinggi di kelasnya dengan baterai 72V35A.',
    description:
      'Garuda EVKuda adalah produk unggulan VIM Motor. Kami menyediakan produk yang sesuai dengan kebutuhan setiap lapisan masyarakat — sepeda listrik, motor listrik, scooter listrik, sepeda gunung hingga sepeda lipat. Garuda EVKuda memuncaki lini produk kami dengan performa, jarak tempuh, dan kenyamanan terbaik.',
    specs: [
      { label: 'Motor Power', value: '2000W' },
      { label: 'Battery', value: 'Lithium 72V35A' },
      { label: 'Jarak Tempuh', value: '± 150 KM' },
      { label: 'Kecepatan Max', value: '~110 KM/Jam' },
      { label: 'Dimensi', value: '1980 x 720 x 1160 mm' },
      { label: 'Ban', value: '13" Tubeless' },
      { label: 'Berat Maksimal', value: '220 KG' },
      { label: 'Waktu Charging', value: '5 - 6 Jam (fast charging)' }
    ],
    features: ['Performa tertinggi di kelasnya', 'Fast charging', 'Dashboard digital full LCD', 'Keyless start system']
  }
]

/** 首页要展示的商品：全部（后续可改成前 8 个做「Produk Unggulan」） */
export const featuredProducts = products.slice(0, 8)

/** 按 id 取商品 */
export function getProductById(id) {
  const numId = Number(id)
  return products.find((p) => p.id === numId) || null
}

/** 相关推荐：同系列优先，不足则用其它商品补齐 */
export function getRelatedProducts(product, limit = 4) {
  if (!product) return products.slice(0, limit)
  const sameSeries = products.filter((p) => p.id !== product.id && p.series === product.series)
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category && p.series !== product.series
  )
  const rest = products.filter((p) => p.id !== product.id && !sameSeries.includes(p) && !sameCategory.includes(p))
  return [...sameSeries, ...sameCategory, ...rest].slice(0, limit)
}

/** 侧栏分类计数（Katalog 页用） */
export function countByCategory(categoryId) {
  if (categoryId === 'semua') return products.length
  return products.filter((p) => p.category === categoryId).length
}
