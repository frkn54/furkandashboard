import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package, AlertCircle } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const SAMPLE_PRODUCTS = [
  { name: 'Kablosuz Bluetooth Kulaklık', description: 'Aktif gürültü engelleme ve 30 saat pil ömrü', price: 899.99, cost: 450.00, stock: 45, barcode: '8697457854125', category: 'Elektronik' },
  { name: 'Fitness Takip Bandı', description: 'Su geçirmez, kalp atış hızı monitörü', price: 349.99, cost: 180.00, stock: 78, barcode: '8697457854132', category: 'Elektronik' },
  { name: 'Organik Yeşil Çay 100gr', description: 'Doğal, katkısız organik yeşil çay', price: 89.99, cost: 35.00, stock: 234, barcode: '8697457854149', category: 'Gıda' },
  { name: 'Yoga Matı Premium', description: 'Kaymaz, ekstra kalın, taşıma çantalı', price: 249.99, cost: 110.00, stock: 32, barcode: '8697457854156', category: 'Spor' },
  { name: 'LED Masa Lambası', description: 'Dokunmatik, 3 renk tonu, USB şarj portlu', price: 199.99, cost: 85.00, stock: 67, barcode: '8697457854163', category: 'Ev & Yaşam' },
  { name: 'Deri Cüzdan Erkek', description: 'Hakiki deri, RFID korumalı, hediye kutusunda', price: 299.99, cost: 120.00, stock: 5, barcode: '8697457854170', category: 'Aksesuar' },
  { name: 'Paslanmaz Çelik Termos 500ml', description: '12 saat sıcak, 24 saat soğuk tutar', price: 149.99, cost: 60.00, stock: 156, barcode: '8697457854187', category: 'Ev & Yaşam' },
  { name: 'Bebek Bakım Çantası', description: 'Su geçirmez, çok bölmeli, değiştirme matı dahil', price: 399.99, cost: 180.00, stock: 23, barcode: '8697457854194', category: 'Bebek' },
  { name: 'Ahşap Oyun Seti', description: 'Eğitici, 3+ yaş, doğal ahşap', price: 179.99, cost: 75.00, stock: 89, barcode: '8697457854200', category: 'Oyuncak' },
  { name: 'Protein Tozu 1kg Çikolatalı', description: 'Whey protein, %80 protein içeriği', price: 449.99, cost: 200.00, stock: 0, barcode: '8697457854217', category: 'Spor' },
  { name: 'Aromaterapi Difüzörü', description: 'Ultrasonik, LED aydınlatmalı, 7 renk', price: 159.99, cost: 70.00, stock: 102, barcode: '8697457854224', category: 'Ev & Yaşam' },
  { name: 'Unisex Sırt Çantası 35L', description: 'Su geçirmez, laptop bölmeli, USB portlu', price: 329.99, cost: 145.00, stock: 41, barcode: '8697457854231', category: 'Çanta' },
  { name: 'Doğal Hindistan Cevizi Yağı', description: 'Soğuk pres, organik, 250ml', price: 119.99, cost: 48.00, stock: 178, barcode: '8697457854248', category: 'Kozmetik' },
  { name: 'Akıllı Bileklik M6', description: 'Adım sayar, uyku takibi, mesaj bildirimi', price: 279.99, cost: 130.00, stock: 8, barcode: '8697457854255', category: 'Elektronik' },
  { name: 'Bambu Sofra Takımı 24 Parça', description: 'Ekolojik, bulaşık makinesinde yıkanabilir', price: 389.99, cost: 165.00, stock: 54, barcode: '8697457854262', category: 'Ev & Yaşam' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    stock: '',
    barcode: '',
    category: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading products:', error);
      return;
    }

    if (data && data.length === 0) {
      setProducts(SAMPLE_PRODUCTS.map((p, i) => ({ ...p, id: `sample-${i}`, user_id: user.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })) as any);
    } else {
      setProducts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const productData = {
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock) || 0,
      barcode: formData.barcode,
      category: formData.category,
      updated_at: new Date().toISOString(),
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        console.error('Error updating product:', error);
        return;
      }
    } else {
      const { error } = await supabase.from('products').insert([productData]);

      if (error) {
        console.error('Error creating product:', error);
        return;
      }
    }

    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      cost: '',
      stock: '',
      barcode: '',
      category: '',
    });
    loadProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      barcode: product.barcode,
      category: product.category,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return;
    }

    loadProducts();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.stock <= 10 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ürünler</h2>
          <p className="text-sm text-gray-500 mt-1">Tüm ürünlerinizi buradan yönetin</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              cost: '',
              stock: '',
              barcode: '',
              category: '',
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-full transition-all transform hover:scale-105 font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Düşük Stok</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stokta Yok</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün adı, kategori veya barkod ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Maliyet</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Barkod</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    {searchTerm ? 'Arama kriterine uygun ürün bulunamadı.' : 'Henüz ürün bulunmuyor. Yeni ürün eklemek için yukarıdaki butona tıklayın.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.category || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₺{parseFloat(product.price.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ₺{parseFloat(product.cost.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-700'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.barcode || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maliyet (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barkod</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all"
                >
                  {editingProduct ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
