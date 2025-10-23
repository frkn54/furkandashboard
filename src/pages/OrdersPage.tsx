import { useState } from 'react';
import { ShoppingCart, Package, Truck, CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  products: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  date: string;
  shippingAddress: string;
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Ayşe Yılmaz',
    customerEmail: 'ayse.yilmaz@email.com',
    products: [
      { name: 'Kablosuz Bluetooth Kulaklık', quantity: 1, price: 899.99 },
      { name: 'LED Masa Lambası', quantity: 2, price: 199.99 },
    ],
    total: 1299.97,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-10-20',
    shippingAddress: 'Bağdat Cad. No:123, Kadıköy, İstanbul',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Mehmet Demir',
    customerEmail: 'mehmet.demir@email.com',
    products: [
      { name: 'Fitness Takip Bandı', quantity: 1, price: 349.99 },
      { name: 'Yoga Matı Premium', quantity: 1, price: 249.99 },
      { name: 'Protein Tozu 1kg Çikolatalı', quantity: 2, price: 449.99 },
    ],
    total: 1499.96,
    status: 'shipped',
    paymentStatus: 'paid',
    date: '2024-10-21',
    shippingAddress: 'Atatürk Bulvarı No:456, Çankaya, Ankara',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Zeynep Kaya',
    customerEmail: 'zeynep.kaya@email.com',
    products: [
      { name: 'Bebek Bakım Çantası', quantity: 1, price: 399.99 },
      { name: 'Ahşap Oyun Seti', quantity: 3, price: 179.99 },
    ],
    total: 939.96,
    status: 'processing',
    paymentStatus: 'paid',
    date: '2024-10-22',
    shippingAddress: 'Kordonboyu No:789, Alsancak, İzmir',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Can Öztürk',
    customerEmail: 'can.ozturk@email.com',
    products: [
      { name: 'Unisex Sırt Çantası 35L', quantity: 1, price: 329.99 },
    ],
    total: 329.99,
    status: 'pending',
    paymentStatus: 'pending',
    date: '2024-10-23',
    shippingAddress: 'Cumhuriyet Cad. No:234, Konak, İzmir',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'Elif Şahin',
    customerEmail: 'elif.sahin@email.com',
    products: [
      { name: 'Aromaterapi Difüzörü', quantity: 2, price: 159.99 },
      { name: 'Doğal Hindistan Cevizi Yağı', quantity: 3, price: 119.99 },
    ],
    total: 679.95,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-10-18',
    shippingAddress: 'Kızılay Meydanı No:567, Çankaya, Ankara',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customerName: 'Burak Yıldız',
    customerEmail: 'burak.yildiz@email.com',
    products: [
      { name: 'Akıllı Bileklik M6', quantity: 1, price: 279.99 },
      { name: 'Paslanmaz Çelik Termos 500ml', quantity: 2, price: 149.99 },
    ],
    total: 579.97,
    status: 'shipped',
    paymentStatus: 'paid',
    date: '2024-10-21',
    shippingAddress: 'Nişantaşı Cad. No:890, Şişli, İstanbul',
  },
  {
    id: '7',
    orderNumber: 'ORD-2024-007',
    customerName: 'Selin Arslan',
    customerEmail: 'selin.arslan@email.com',
    products: [
      { name: 'Bambu Sofra Takımı 24 Parça', quantity: 1, price: 389.99 },
      { name: 'Organik Yeşil Çay 100gr', quantity: 5, price: 89.99 },
    ],
    total: 839.94,
    status: 'delivered',
    paymentStatus: 'paid',
    date: '2024-10-19',
    shippingAddress: 'Barış Mahallesi No:345, Keçiören, Ankara',
  },
  {
    id: '8',
    orderNumber: 'ORD-2024-008',
    customerName: 'Emre Çelik',
    customerEmail: 'emre.celik@email.com',
    products: [
      { name: 'Deri Cüzdan Erkek', quantity: 2, price: 299.99 },
    ],
    total: 599.98,
    status: 'cancelled',
    paymentStatus: 'refunded',
    date: '2024-10-20',
    shippingAddress: 'İstiklal Cad. No:678, Beyoğlu, İstanbul',
  },
];

export default function OrdersPage() {
  const [orders] = useState<Order[]>(SAMPLE_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    const labels = {
      pending: 'Beklemede',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal',
    };
    return (
      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      refunded: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      paid: 'Ödendi',
      pending: 'Bekliyor',
      refunded: 'İade',
    };
    return (
      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Siparişler</h2>
          <p className="text-sm text-gray-500 mt-1">Tüm siparişlerinizi takip edin</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Toplam</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Beklemede</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Package className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Hazırlanıyor</p>
              <p className="text-xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <Package className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Kargoda</p>
              <p className="text-xl font-bold text-purple-600">{stats.shipped}</p>
            </div>
            <Truck className="w-5 h-5 text-purple-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Teslim</p>
              <p className="text-xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">İptal</p>
              <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sipariş no, müşteri adı veya e-posta ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Beklemede</option>
                <option value="processing">Hazırlanıyor</option>
                <option value="shipped">Kargoda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ödeme</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    {searchTerm || statusFilter !== 'all' ? 'Arama kriterine uygun sipariş bulunamadı.' : 'Henüz sipariş bulunmuyor.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(order.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₺{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Sipariş Detayları</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sipariş No</p>
                  <p className="font-medium text-gray-900">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tarih</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedOrder.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Durum</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ödeme Durumu</p>
                  {getPaymentBadge(selectedOrder.paymentStatus)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Müşteri Bilgileri</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                  <p className="text-sm text-gray-600 mt-2">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ürünler</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ürün</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Adet</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Fiyat</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Toplam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-center">{product.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">₺{product.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            ₺{(product.price * product.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                          Toplam:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          ₺{selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
