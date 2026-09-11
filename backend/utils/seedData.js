export const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Next-gen audio gear, flagship smart wearables, cameras, and computing essentials.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    icon: 'Headphones',
    isFeatured: true
  },
  {
    name: 'Fashion & Apparel',
    slug: 'fashion',
    description: 'Elevated streetwear, premium linen shirts, festive ethnic wear, and luxury staples.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    icon: 'Shirt',
    isFeatured: true
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Performance marathon runners, handcrafted leather shoes, and street sneakers.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    icon: 'Footprints',
    isFeatured: true
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Full-grain leather wallets, polarized eyewear, tech bags, and luxury chronographs.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    icon: 'Watch',
    isFeatured: true
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Aesthetic ceramic decor, precision barista machines, and ergonomic work setups.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    icon: 'Home',
    isFeatured: true
  },
  {
    name: 'Beauty & Wellness',
    slug: 'beauty',
    description: 'Ayurvedic formulations, botanical skincare serums, and luxury fragrance mists.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    icon: 'Sparkles',
    isFeatured: true
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports',
    description: 'High-tensile resistance gear, smart recovery guns, and premium yoga mats.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    icon: 'Activity',
    isFeatured: false
  }
];

export const products = [
  // 1. Electronics (₹1,499 – ₹89,999)
  {
    name: 'AeroSound Pro Wireless ANC Headphones',
    slug: 'aerosound-pro-wireless-anc-headphones',
    categorySlug: 'electronics',
    brand: 'AeroSound',
    price: 19999,
    discountPrice: 14999,
    description: 'Immerse yourself in pure studio-grade audio with hybrid Active Noise Cancellation, 40-hour battery life, and ultra-soft memory foam ear cushions.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 28,
    rating: 4.8,
    numReviews: 142,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['wireless', 'noise-cancelling', 'headphones', 'bluetooth', 'audio'],
    colors: ['Midnight Black', 'Platinum Silver', 'Navy Blue'],
    specs: [
      { key: 'Driver Size', value: '45mm Custom Titanium' },
      { key: 'Battery Life', value: '40 Hours (ANC On)' },
      { key: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm Aux' },
      { key: 'Warranty', value: '1 Year Brand Warranty in India' }
    ]
  },
  {
    name: 'Apex Horizon Ultra AMOLED Smartwatch',
    slug: 'apex-horizon-ultra-smartwatch',
    categorySlug: 'electronics',
    brand: 'Apex Tech',
    price: 24999,
    discountPrice: 18999,
    description: 'Rugged aerospace titanium case, sapphire crystal AMOLED display, multi-band GPS, and comprehensive SpO2 / ECG biometric health sensors.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 19,
    rating: 4.7,
    numReviews: 98,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['smartwatch', 'fitness', 'gps', 'health', 'wearable'],
    colors: ['Space Gray', 'Titanium Silver', 'Obsidian Black'],
    specs: [
      { key: 'Display', value: '1.92-inch AMOLED Always-On (1000 nits)' },
      { key: 'Water Resistance', value: '50m (5 ATM Waterproof)' },
      { key: 'Battery', value: 'Up to 7 Days Normal Use' },
      { key: 'Sensors', value: 'SpO2, ECG, Heart Rate, Compass' }
    ]
  },
  {
    name: 'Lumix Zen 4K Vlogging Mirrorless Camera',
    slug: 'lumix-zen-4k-vlogging-mirrorless-camera',
    categorySlug: 'electronics',
    brand: 'Zenith Optical',
    price: 79999,
    discountPrice: 69999,
    description: 'Ultra-compact 4K 60fps mirrorless camera with real-time eye autofocus, articulated flip screen, and internal 5-axis sensor stabilization.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    rating: 4.9,
    numReviews: 64,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['camera', '4k', 'photography', 'vlog', 'video'],
    colors: ['Classic Black'],
    specs: [
      { key: 'Sensor', value: '24.2 MP APS-C CMOS' },
      { key: 'Video Resolution', value: '4K @ 60fps 10-bit HDR' },
      { key: 'Autofocus', value: '425 Phase Detection Points' }
    ]
  },
  {
    name: 'SoundSphere Portable 360 Bluetooth Speaker',
    slug: 'soundsphere-portable-360-bluetooth-speaker',
    categorySlug: 'electronics',
    brand: 'AeroSound',
    price: 5999,
    discountPrice: 3999,
    description: 'IP67 waterproof portable cylinder speaker delivering punchy 360-degree room-filling acoustic sound with deep bass and 24 hours playtime.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    rating: 4.6,
    numReviews: 213,
    isFeatured: false,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['speaker', 'bluetooth', 'waterproof', 'portable'],
    colors: ['Charcoal', 'Forest Green', 'Teal Blue'],
    specs: [
      { key: 'Output Power', value: '30W RMS Dual Radiator' },
      { key: 'Battery Life', value: '24 Hours Playtime' },
      { key: 'Waterproof', value: 'IP67 Dust & Water' }
    ]
  },
  {
    name: 'PulseBuds Air True Wireless ANC Earbuds',
    slug: 'pulsebuds-air-true-wireless-earbuds',
    categorySlug: 'electronics',
    brand: 'Pulse Audio',
    price: 4999,
    discountPrice: 2999,
    description: 'Featherlight earbuds with 32dB active noise cancellation, low-latency gaming mode, dual beamforming mics, and rapid Type-C fast charging.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    rating: 4.7,
    numReviews: 187,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
    isNewArrival: true,
    tags: ['earbuds', 'wireless', 'bluetooth', 'audio', 'tws'],
    colors: ['Gloss White', 'Matte Black', 'Cosmic Blue'],
    specs: [
      { key: 'Playtime', value: '36 Hours Total (8h buds + 28h case)' },
      { key: 'Latency', value: '45ms Ultra Low Latency' },
      { key: 'Charging', value: '10 min charge = 120 min play' }
    ]
  },
  {
    name: 'HyperDrive 65W GaN Fast Charger',
    slug: 'hyperdrive-65w-gan-fast-charger',
    categorySlug: 'electronics',
    brand: 'Apex Tech',
    price: 2999,
    discountPrice: 1999,
    description: 'Compact Gallium Nitride (GaN) triple-port fast wall charger with dual USB-C 65W Power Delivery and USB-A Quick Charge 3.0 support.',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 60,
    rating: 4.8,
    numReviews: 92,
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['charger', 'gan', 'fast-charging', 'type-c'],
    colors: ['Ceramic White', 'Space Grey'],
    specs: [
      { key: 'Total Output', value: '65W Max Power Delivery' },
      { key: 'Ports', value: '2x Type-C + 1x USB-A' }
    ]
  },

  // 2. Fashion & Apparel (₹499 – ₹5,999)
  {
    name: 'Urban Luxe Minimalist Wool Trench Coat',
    slug: 'urban-luxe-minimalist-wool-trench-coat',
    categorySlug: 'fashion',
    brand: 'Nordic Atelier',
    price: 6499,
    discountPrice: 4999,
    description: 'Tailored from premium double-faced wool blend, featuring an elegant storm flap, notched lapels, and detachable structured tie belt.',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    rating: 4.9,
    numReviews: 49,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['coat', 'wool', 'winter', 'jacket', 'trench'],
    colors: ['Camel Beige', 'Charcoal Grey', 'Deep Camel'],
    sizes: ['S', 'M', 'L', 'XL'],
    specs: [
      { key: 'Material', value: '70% Wool, 30% Cashmere Blend' },
      { key: 'Lining', value: '100% Cupro Silk' },
      { key: 'Care', value: 'Dry Clean Only' }
    ]
  },
  {
    name: 'Essential Heavyweight Oversized Hoodie',
    slug: 'essential-heavyweight-oversized-hoodie',
    categorySlug: 'fashion',
    brand: 'Studio Raw',
    price: 2999,
    discountPrice: 1999,
    description: 'Cut from 480 GSM French Terry organic cotton with relaxed drop shoulders, double-layered hood, and durable ribbed cuffs that hold shape.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 42,
    rating: 4.8,
    numReviews: 188,
    isFeatured: false,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['hoodie', 'streetwear', 'cotton', 'oversized'],
    colors: ['Washed Black', 'Oatmeal Heather', 'Olive Green', 'Clay Pink'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specs: [
      { key: 'Fabric', value: '480 GSM 100% Organic Cotton' },
      { key: 'Fit', value: 'Boxy / Oversized Drop Shoulder' }
    ]
  },
  {
    name: 'Tailored Slim-Fit Japanese Selvedge Denim',
    slug: 'tailored-slim-fit-japanese-selvedge-denim',
    categorySlug: 'fashion',
    brand: 'Studio Raw',
    price: 4999,
    discountPrice: 3499,
    description: 'Crafted on vintage shuttle looms in Okayama using 14oz raw indigo selvedge cotton. Develops unique authentic patina over time.',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 22,
    rating: 4.7,
    numReviews: 71,
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['denim', 'jeans', 'selvedge', 'pants', 'cotton'],
    colors: ['Raw Indigo', 'Faded Stone Wash'],
    sizes: ['30', '32', '34', '36'],
    specs: [
      { key: 'Weight', value: '14oz Raw Japanese Selvedge' },
      { key: 'Hardware', value: 'Custom Antique Brass Rivets' }
    ]
  },
  {
    name: 'Pure Mulberry Silk Festive Kurta Set',
    slug: 'pure-mulberry-silk-festive-kurta-set',
    categorySlug: 'fashion',
    brand: 'Maison Étoile',
    price: 5999,
    discountPrice: 3999,
    description: 'Exquisite hand-woven Chanderi silk kurta with intricate Zari embroidery on neckline, paired with tailored straight trousers and sheer organza dupatta.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    rating: 4.9,
    numReviews: 53,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: true,
    tags: ['ethnic', 'kurta', 'festive', 'silk', 'embroidery'],
    colors: ['Royal Emerald', 'Mustard Gold', 'Blush Rose'],
    sizes: ['S', 'M', 'L', 'XL'],
    specs: [
      { key: 'Fabric', value: 'Chanderi Mulberry Silk' },
      { key: 'Workmanship', value: 'Handcrafted Zari & Resham Thread' }
    ]
  },
  {
    name: 'Supima Cotton Classic Cuban Collar Shirt',
    slug: 'supima-cotton-classic-cuban-collar-shirt',
    categorySlug: 'fashion',
    brand: 'Nordic Atelier',
    price: 2499,
    discountPrice: 1499,
    description: 'Breezy luxury resort shirt tailored from 100% American Supima extra-long staple cotton with mother-of-pearl buttons and relaxed boxy drape.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    rating: 4.7,
    numReviews: 62,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['shirt', 'cotton', 'summer', 'resort-wear'],
    colors: ['Ivory Sand', 'Olive Sage', 'Sky Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    specs: [
      { key: 'Material', value: '100% Supima Cotton (60s Yarn)' },
      { key: 'Fit', value: 'Relaxed Resort Fit' }
    ]
  },

  // 3. Footwear (₹799 – ₹7,999)
  {
    name: 'AeroGlide Carbon Fiber Marathon Running Shoes',
    slug: 'aeroglide-carbon-fiber-marathon-running-shoes',
    categorySlug: 'footwear',
    brand: 'Velocity Kicks',
    price: 7999,
    discountPrice: 5999,
    description: 'Engineered with full-length carbon propulsion plate and supercritical PEBA foam midsole for explosive energy return on race day.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    rating: 4.9,
    numReviews: 126,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['shoes', 'running', 'sneakers', 'sports', 'marathon'],
    colors: ['Laser Crimson', 'Volt Green', 'Triple White'],
    sizes: ['7', '8', '9', '10', '11'],
    specs: [
      { key: 'Drop', value: '8mm Heel-to-Toe' },
      { key: 'Plate', value: '3D Curved Carbon Fiber Propulsion' },
      { key: 'Weight', value: '195g (UK Size 8)' }
    ]
  },
  {
    name: 'Craftsman Chelsea Boots in Hand-Burnished Leather',
    slug: 'craftsman-chelsea-boots-in-hand-burnished-leather',
    categorySlug: 'footwear',
    brand: 'Vanguard Bootmakers',
    price: 8999,
    discountPrice: 6999,
    description: 'Handcrafted Chelsea boots built from full-grain calfskin leather with elastic side gussets and storm welt Vibram non-slip outsoles.',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    rating: 4.8,
    numReviews: 68,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['boots', 'leather', 'chelsea', 'footwear', 'menswear'],
    colors: ['Rich Walnut Brown', 'Matte Onyx Black'],
    sizes: ['7', '8', '9', '10', '11'],
    specs: [
      { key: 'Construction', value: 'Goodyear Welted Stitched' },
      { key: 'Upper', value: 'Full Grain European Leather' },
      { key: 'Sole', value: 'Vibram Studded Rubber' }
    ]
  },
  {
    name: 'Cloudfoam Retro Court Low Sneakers',
    slug: 'cloudfoam-retro-court-low-sneakers',
    categorySlug: 'footwear',
    brand: 'Velocity Kicks',
    price: 4499,
    discountPrice: 2999,
    description: 'Timeless vintage court sneaker silhouette updated with plush memory foam insole and supple tumbled leather upper for effortless daily wear.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    rating: 4.6,
    numReviews: 114,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['sneakers', 'retro', 'streetwear', 'white-shoes'],
    colors: ['White / Forest Green', 'White / Navy', 'Triple White'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    specs: [
      { key: 'Upper', value: 'Tumbled Leather & Suede Accent' },
      { key: 'Insole', value: 'High Density OrthoLite Cushioning' }
    ]
  },

  // 4. Accessories (₹199 – ₹4,999)
  {
    name: 'Voyager Waterproof Tech Commuter Backpack',
    slug: 'voyager-waterproof-tech-commuter-backpack',
    categorySlug: 'accessories',
    brand: 'Nomad Goods',
    price: 4999,
    discountPrice: 3499,
    description: 'Streamlined 24L weatherproof roll-top backpack with magnetic Fidlock closures, padded 16-inch laptop compartment, and hidden passport security pocket.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 27,
    rating: 4.9,
    numReviews: 88,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['backpack', 'travel', 'commuter', 'tech', 'waterproof'],
    colors: ['Stealth Black', 'Slate Grey', 'Olive Moss'],
    specs: [
      { key: 'Capacity', value: '24 Liters Expandable to 28L' },
      { key: 'Laptop Fit', value: 'Up to 16" MacBook Pro / Gaming Laptop' },
      { key: 'Material', value: 'Cordura 500D Ballistic Nylon' }
    ]
  },
  {
    name: 'Aviator Polarized Titanium Sunglasses',
    slug: 'aviator-polarized-titanium-sunglasses',
    categorySlug: 'accessories',
    brand: 'Solstice Optics',
    price: 3499,
    discountPrice: 2299,
    description: 'Featherlight beta-titanium teardrop frame equipped with Category 3 HD polarized lenses providing 100% UV400 solar protection and glare reduction.',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 32,
    rating: 4.7,
    numReviews: 79,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: false,
    tags: ['sunglasses', 'eyewear', 'polarized', 'summer'],
    colors: ['Gold / Forest Green', 'Matte Black / Smoke Grey'],
    specs: [
      { key: 'Frame', value: 'Japanese Beta-Titanium (18g weight)' },
      { key: 'Lens', value: 'Polarized UV400 Anti-Scratch Glass' }
    ]
  },
  {
    name: 'Bifold RFID-Blocking Full Grain Leather Wallet',
    slug: 'bifold-rfid-blocking-full-grain-leather-wallet',
    categorySlug: 'accessories',
    brand: 'Nomad Goods',
    price: 1899,
    discountPrice: 1299,
    description: 'Slim bifold wallet constructed from top-grain oil-waxed leather with 8 card slots, quick-draw ID window, and certified RFID shielding.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    rating: 4.8,
    numReviews: 143,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['wallet', 'leather', 'rfid', 'accessories'],
    colors: ['Cognac Tan', 'Espresso Black'],
    specs: [
      { key: 'Capacity', value: '8 Card Slots + Full Currency Note Pocket' },
      { key: 'Security', value: '13.56 MHz RFID Shielding' }
    ]
  },

  // 5. Home & Living (₹299 – ₹19,999)
  {
    name: 'Artisan Barista Precision Espresso Machine',
    slug: 'artisan-barista-precision-espresso-machine',
    categorySlug: 'home-living',
    brand: 'Modena Kitchen',
    price: 28999,
    discountPrice: 22999,
    description: 'Commercial-grade dual thermoblock coffee machine with digital PID temperature gauge, 58mm stainless portafilter, and high-pressure steam wand.',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9,
    rating: 4.9,
    numReviews: 84,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['coffee', 'espresso', 'kitchen', 'appliance', 'barista'],
    colors: ['Brushed Stainless Steel', 'Matte Black Edition'],
    specs: [
      { key: 'Pump Pressure', value: '15 Bar Italian Ulka Pump' },
      { key: 'Boiler', value: 'Dual Thermoblock Instant Heating' },
      { key: 'Water Tank', value: '2.5 Liters Removable' }
    ]
  },
  {
    name: 'Ergonomic Mesh Lumbar Executive Chair',
    slug: 'ergonomic-mesh-lumbar-executive-chair',
    categorySlug: 'home-living',
    brand: 'ErgoForm',
    price: 18999,
    discountPrice: 14499,
    description: 'Engineered for 12+ hour workspace comfort with dynamic auto-adjusting lumbar spine tracking, 4D adjustable armrests, and 135° tilt-lock recline.',
    images: [
      'https://images.unsplash.com/photo-1580481077111-9a73041696b9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    rating: 4.8,
    numReviews: 95,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['chair', 'ergonomic', 'office', 'furniture', 'workspace'],
    colors: ['Space Grey', 'All Black'],
    specs: [
      { key: 'Weight Capacity', value: '150 kg Tested' },
      { key: 'Mechanism', value: 'Multi-lock Synchro-Tilt Class 4 Gas Lift' },
      { key: 'Warranty', value: '3 Years On-Site Support' }
    ]
  },
  {
    name: 'Nordic Ceramic Minimalist Table Lamp',
    slug: 'nordic-ceramic-minimalist-table-lamp',
    categorySlug: 'home-living',
    brand: 'Hygge Home',
    price: 2999,
    discountPrice: 1999,
    description: 'Hand-molded stoneware table lamp with soft diffused organic linen shade and 3-step capacitive touch dimming base for cozy bedroom ambient light.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 26,
    rating: 4.7,
    numReviews: 43,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['lamp', 'lighting', 'decor', 'ceramic', 'nordic'],
    colors: ['Warm Sand', 'Terracotta Red', 'Off-White'],
    specs: [
      { key: 'Dimensions', value: 'Height 42cm x Dia 25cm' },
      { key: 'Bulb', value: 'Warm 2700K Warm Glow LED Included' }
    ]
  },
  {
    name: 'Ultrasonic Ceramic Aromatherapy Oil Diffuser',
    slug: 'ultrasonic-ceramic-aromatherapy-oil-diffuser',
    categorySlug: 'home-living',
    brand: 'Hygge Home',
    price: 2499,
    discountPrice: 1699,
    description: 'Handcrafted ribbed ceramic cover with whisper-quiet ultrasonic cold mist atomization, auto shut-off, and subtle 7-color warm breathing glow.',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    rating: 4.6,
    numReviews: 57,
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['diffuser', 'aromatherapy', 'wellness', 'home'],
    colors: ['Stone White', 'Muted Terracotta'],
    specs: [
      { key: 'Capacity', value: '300ml (12 Hours Continuous Mist)' },
      { key: 'Sound Level', value: '< 20 dB Whisper Silent' }
    ]
  },

  // 6. Beauty & Wellness (₹299 – ₹4,999)
  {
    name: 'Kumkumadi Radiance Glow Facial Oil (30ml)',
    slug: 'kumkumadi-radiance-glow-facial-oil',
    categorySlug: 'beauty',
    brand: 'AyurVeda Luxe',
    price: 2499,
    discountPrice: 1799,
    description: 'Traditional 100% pure saffron infusion formulated with 26 Kashmiri herbs and pure goat milk to brighten dull skin, even tone, and boost luminosity.',
    images: [
      'https://images.unsplash.com/photo-1608248597359-002d2c1844b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    rating: 4.9,
    numReviews: 168,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: true,
    tags: ['skincare', 'kumkumadi', 'ayurvedic', 'serum', 'glow'],
    colors: ['Golden Nectar'],
    specs: [
      { key: 'Volume', value: '30 ml Glass Dropper' },
      { key: 'Key Actives', value: 'Kashmiri Saffron, Sandalwood, Lotus' }
    ]
  },
  {
    name: 'Botanical Vitamin C & Hyaluronic Brightening Serum',
    slug: 'botanical-vitamin-c-hyaluronic-brightening-serum',
    categorySlug: 'beauty',
    brand: 'PureBotanics',
    price: 1499,
    discountPrice: 999,
    description: 'Concentrated 15% Ethyl Ascorbic Acid stabilized with Ferulic Acid and tri-molecular Hyaluronic Acid for intense hydration and dark spot reduction.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 48,
    rating: 4.7,
    numReviews: 89,
    isFeatured: false,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['skincare', 'vitamin-c', 'serum', 'hydration'],
    colors: ['Clear'],
    specs: [
      { key: 'Concentration', value: '15% Stabilized Vitamin C + 1% Hyaluronic Acid' },
      { key: 'Skin Type', value: 'All Skin Types (Non-comedogenic)' }
    ]
  },

  // 7. Sports & Fitness (₹499 – ₹12,999)
  {
    name: 'HyperPulse Deep Tissue Pro Massage Gun',
    slug: 'hyperpulse-deep-tissue-pro-massage-gun',
    categorySlug: 'sports',
    brand: 'Velocity Kicks',
    price: 6999,
    discountPrice: 4499,
    description: 'Brushless high-torque motor delivering 3200 percussions per minute with 6 interchangeable therapeutic heads, LCD screen, and carry case.',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 22,
    rating: 4.8,
    numReviews: 76,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['fitness', 'massage-gun', 'recovery', 'workout'],
    colors: ['Carbon Black', 'Steel Silver'],
    specs: [
      { key: 'Speed Levels', value: '30 Speed Settings (1200 - 3200 RPM)' },
      { key: 'Battery', value: '2600mAh (6 Hours Continuous)' }
    ]
  }
];

export const sampleAddresses = [
  {
    label: 'Home',
    fullName: 'Rahul Sharma',
    phone: '+91 9876543210',
    houseNo: 'Flat 402, Building B',
    street: 'Palm Grove Avenue, Powai',
    landmark: 'Near Hiranandani Gardens',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400076',
    country: 'India',
    isDefault: true
  },
  {
    label: 'Work',
    fullName: 'Rahul Sharma',
    phone: '+91 9876543210',
    houseNo: 'Tower 3, 5th Floor',
    street: 'Prestige Tech Cloud, Indiranagar',
    landmark: 'Opposite Metro Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    isDefault: false
  }
];

export const sampleReviews = [
  {
    rating: 5,
    title: 'Superb quality and rapid delivery in Mumbai!',
    comment: 'The build quality exceeded all my expectations. Sound is rich and punchy with deep bass. Delivered within 2 days via Express delivery. 100% genuine product!',
    isVerifiedPurchase: true
  },
  {
    rating: 5,
    title: 'Best purchase on ShopSphere!',
    comment: 'Seamless UPI checkout with PhonePe and prompt tracking updates on WhatsApp/SMS. Packaging was super secure with bubble wraps.',
    isVerifiedPurchase: true
  },
  {
    rating: 4,
    title: 'Great value for money in INR',
    comment: 'Very premium look and feel. Exactly as described in the specs. Customer support in Bengaluru resolved my query immediately.',
    isVerifiedPurchase: true
  }
];
