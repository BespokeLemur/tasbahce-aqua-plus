// Initial mock database for Taşbahçe Aqua Plus
export const initialMenu = [
  // Yemekler
  {
    id: 'm1',
    name: 'Taşbahçe Burger',
    price: 320,
    description: '180g özel köfte, karamelize soğan, cheddar peyniri, özel sos ve patates kızartması ile.',
    category: 'yemek',
    image: '/images/burger.jpg'
  },
  {
    id: 'm2',
    name: 'Kasap Izgara Köfte',
    price: 380,
    description: 'Közlenmiş biber, domates, pilav ve lavaş eşliğinde ev yapımı ızgara köfte.',
    category: 'yemek',
    image: '/images/kofte.jpg'
  },
  {
    id: 'm3',
    name: 'Margarita Pizza',
    price: 290,
    description: 'Özel domates sosu, mozzarella peyniri, taze fesleğen ve zeytinyağı.',
    category: 'yemek',
    image: '/images/pizza.jpg'
  },
  {
    id: 'm4',
    name: 'Sezar Salata',
    price: 240,
    description: 'Izgara tavuk dilimleri, marul, kruton ekmek, parmesan peyniri ve özel sezar sos.',
    category: 'yemek',
    image: '/images/salata.jpg'
  },

  // İçecekler
  {
    id: 'm5',
    name: 'Ev Yapımı Limonata',
    price: 95,
    description: 'Taze nane yaprakları ve limon dilimleri ile soğuk servis edilir.',
    category: 'icecek',
    image: '/images/limonata.jpg'
  },
  {
    id: 'm6',
    name: 'Türk Kahvesi',
    price: 80,
    description: 'Geleneksel sunumu, çikolata ve su eşliğinde.',
    category: 'icecek',
    image: '/images/turk_kahvesi.jpg'
  },
  {
    id: 'm7',
    name: 'Iced Latte',
    price: 110,
    description: 'Soğuk süt, espresso ve buz taneleri ile ferahlatıcı kahve keyfi.',
    category: 'icecek',
    image: '/images/iced_latte.jpg'
  },
  {
    id: 'm8',
    name: 'Taze Portakal Suyu',
    price: 120,
    description: 'Günlük taze sıkılmış portakal suyu.',
    category: 'icecek',
    image: '/images/portakal_suyu.jpg'
  },

  // Tatlılar
  {
    id: 'm9',
    name: 'San Sebastian Cheesecake',
    price: 190,
    description: 'İçi akışkan kıvamda, üzerine sıcak çikolata sosu ile.',
    category: 'tatli',
    image: '/images/cheesecake.jpg'
  },
  {
    id: 'm10',
    name: 'Çikolatalı Waffle',
    price: 210,
    description: 'Taze çilek, muz, kivi, çikolata sosu ve antep fıstığı ile.',
    category: 'tatli',
    image: '/images/waffle.jpg'
  },

  // Nargileler
  {
    id: 'm11',
    name: 'Love 66 Premium',
    price: 450,
    description: 'Kavun, karpuz, nane ve özel tatlı meyve karışımı ile ferahlatıcı nargile.',
    category: 'nargile',
    image: '/images/nargile_love.jpg'
  },
  {
    id: 'm12',
    name: 'Taşbahçe Special',
    price: 520,
    description: 'Ananas, şeftali, taze nane ve özel buzlu marpucu ile Taşbahçe klasiği.',
    category: 'nargile',
    image: '/images/nargile_special.jpg'
  },
  {
    id: 'm13',
    name: 'Çift Elma & Nane',
    price: 400,
    description: 'Klasik tütün sevenler için anason, çift elma ve ferah nane esintisi.',
    category: 'nargile',
    image: '/images/nargile_elma.jpg'
  }
];

export const initialUsers = [
  { id: 'u1', username: 'admin', password: '123', name: 'Yönetici Ahmet', role: 'admin' },
  { id: 'u2', username: 'garson', password: '123', name: 'Garson Mehmet', role: 'garson' },
  { id: 'u3', username: 'mutfak', password: '123', name: 'Kafe Mutfak', role: 'mutfak' },
  { id: 'u4', username: 'nargile', password: '123', name: 'Nargile Kafe', role: 'nargile' }
];

export const initialTables = Array.from({ length: 20 }, (_, i) => ({
  id: `masa-${i + 1}`,
  name: `Masa ${i + 1}`
}));
