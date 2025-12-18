export const womensFashionProducts = [
  'Saten Midi Elbise - Siyah',
  'Yüksek Bel Mom Jean',
  'Oversize Triko Kazak - Bej',
  'Dantel Detaylı Bluz',
  'Pileli Şifon Etek',
  'Deri Görünümlü Blazer',
  'Zarif Maxi Elbise - Bordo',
  'Crop Tişört - Beyaz',
  'Wide Leg Pantolon',
  'İşlemeli Kimono',
  'V Yaka Triko Hırka',
  'Desenli Midi Etek',
  'Kolsuz Gömlek Elbise',
  'Yün Karışımlı Palto',
  'Bodycon Mini Elbise',
  'Yüksek Bel Denim Şort',
  'Saten Gömlek - Pudra',
  'Tül Detaylı Etek',
  'Omuz Açık Bluz',
  'Çiçek Desenli Elbise',
  'Basic Pamuklu Tişört',
  'Triko Yelek',
  'Desenli Kimono',
  'Asimetrik Kesim Etek',
  'Keten Karışımlı Pantolon',
];

export const fashionBrandStats = {
  totalSales: 127450.75,
  netSales: 118230.20,
  orderCount: 487,
  returnRate: 7.2,
  pendingShipments: 23,
};

export const topSellingProducts = [
  { name: 'Saten Midi Elbise - Siyah', sales: 142, revenue: 12780 },
  { name: 'Yüksek Bel Mom Jean', sales: 128, revenue: 10240 },
  { name: 'Oversize Triko Kazak - Bej', sales: 115, revenue: 9775 },
  { name: 'Dantel Detaylı Bluz', sales: 98, revenue: 7840 },
  { name: 'Pileli Şifon Etek', sales: 87, revenue: 6960 },
];

export const customerNames = [
  'Ayşe Yılmaz',
  'Zeynep Kaya',
  'Elif Demir',
  'Merve Çelik',
  'Selin Şahin',
  'Defne Yıldız',
  'Büşra Aydın',
  'Esra Özkan',
  'Gamze Arslan',
  'İrem Doğan',
  'Ceren Kılıç',
  'Nisa Yılmaz',
  'Ecrin Çetin',
  'Beyza Koç',
  'Melisa Kara',
];

export function generateSalesData(days: number = 7) {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const baseAmount = Math.random() * 5000 + 2000;
    data.push({
      date: dateStr,
      amount: parseFloat(baseAmount.toFixed(2)),
    });
  }

  return data;
}

export function generateReturnsData(days: number = 7) {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const baseAmount = Math.random() * 800 + 200;
    data.push({
      date: dateStr,
      amount: parseFloat(baseAmount.toFixed(2)),
    });
  }

  return data;
}

const productImages = [
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
];

export function getRandomProducts(count: number = 5) {
  const shuffled = [...womensFashionProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((name, index) => ({
    name,
    sales: Math.floor(Math.random() * 80) + 40,
    image_url: productImages[index % productImages.length],
  }));
}
