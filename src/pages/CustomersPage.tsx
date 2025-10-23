import { useState } from 'react';
import { Users, Mail, Phone, MapPin, ShoppingBag, Calendar, Search, Eye, Star } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
  loyaltyPoints: number;
  notes: string;
}

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Ayşe Yılmaz',
    email: 'ayse.yilmaz@email.com',
    phone: '+90 532 111 2233',
    address: 'Bağdat Cad. No:123',
    city: 'İstanbul',
    joinDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 8599.88,
    lastOrderDate: '2024-10-20',
    status: 'active',
    loyaltyPoints: 859,
    notes: 'VIP müşteri, hızlı teslimat tercih ediyor',
  },
  {
    id: '2',
    name: 'Mehmet Demir',
    email: 'mehmet.demir@email.com',
    phone: '+90 533 444 5566',
    address: 'Atatürk Bulvarı No:456',
    city: 'Ankara',
    joinDate: '2024-02-20',
    totalOrders: 8,
    totalSpent: 5234.92,
    lastOrderDate: '2024-10-21',
    status: 'active',
    loyaltyPoints: 523,
    notes: 'Spor ürünleri ile ilgileniyor',
  },
  {
    id: '3',
    name: 'Zeynep Kaya',
    email: 'zeynep.kaya@email.com',
    phone: '+90 534 777 8899',
    address: 'Kordonboyu No:789',
    city: 'İzmir',
    joinDate: '2024-03-10',
    totalOrders: 15,
    totalSpent: 12450.75,
    lastOrderDate: '2024-10-22',
    status: 'active',
    loyaltyPoints: 1245,
    notes: 'Bebek ürünleri alıyor, hediye paketi istiyor',
  },
  {
    id: '4',
    name: 'Can Öztürk',
    email: 'can.ozturk@email.com',
    phone: '+90 535 222 3344',
    address: 'Cumhuriyet Cad. No:234',
    city: 'İzmir',
    joinDate: '2024-01-25',
    totalOrders: 3,
    totalSpent: 1289.97,
    lastOrderDate: '2024-10-23',
    status: 'active',
    loyaltyPoints: 128,
    notes: 'Elektronik ürünler tercih ediyor',
  },
  {
    id: '5',
    name: 'Elif Şahin',
    email: 'elif.sahin@email.com',
    phone: '+90 536 555 6677',
    address: 'Kızılay Meydanı No:567',
    city: 'Ankara',
    joinDate: '2024-04-05',
    totalOrders: 18,
    totalSpent: 9876.45,
    lastOrderDate: '2024-10-18',
    status: 'active',
    loyaltyPoints: 987,
    notes: 'Organik ve doğal ürünler tercih ediyor',
  },
  {
    id: '6',
    name: 'Burak Yıldız',
    email: 'burak.yildiz@email.com',
    phone: '+90 537 888 9900',
    address: 'Nişantaşı Cad. No:890',
    city: 'İstanbul',
    joinDate: '2024-02-14',
    totalOrders: 6,
    totalSpent: 3456.82,
    lastOrderDate: '2024-10-21',
    status: 'active',
    loyaltyPoints: 345,
    notes: 'Teknoloji ürünleri takip ediyor',
  },
  {
    id: '7',
    name: 'Selin Arslan',
    email: 'selin.arslan@email.com',
    phone: '+90 538 111 2222',
    address: 'Barış Mahallesi No:345',
    city: 'Ankara',
    joinDate: '2024-05-12',
    totalOrders: 10,
    totalSpent: 6543.21,
    lastOrderDate: '2024-10-19',
    status: 'active',
    loyaltyPoints: 654,
    notes: 'Ev dekorasyon ürünleri alıyor',
  },
  {
    id: '8',
    name: 'Emre Çelik',
    email: 'emre.celik@email.com',
    phone: '+90 539 333 4444',
    address: 'İstiklal Cad. No:678',
    city: 'İstanbul',
    joinDate: '2024-06-18',
    totalOrders: 4,
    totalSpent: 2198.76,
    lastOrderDate: '2024-09-15',
    status: 'inactive',
    loyaltyPoints: 219,
    notes: 'İade işlemi gerçekleştirdi',
  },
  {
    id: '9',
    name: 'Deniz Polat',
    email: 'deniz.polat@email.com',
    phone: '+90 541 555 6666',
    address: 'Güzelyalı Mah. No:901',
    city: 'İzmir',
    joinDate: '2024-03-22',
    totalOrders: 14,
    totalSpent: 10234.56,
    lastOrderDate: '2024-10-22',
    status: 'active',
    loyaltyPoints: 1023,
    notes: 'Toplu alım yapıyor, indirim bekliyor',
  },
  {
    id: '10',
    name: 'Esra Kılıç',
    email: 'esra.kilic@email.com',
    phone: '+90 542 777 8888',
    address: 'Çankaya Cad. No:123',
    city: 'Ankara',
    joinDate: '2024-07-08',
    totalOrders: 7,
    totalSpent: 4567.89,
    lastOrderDate: '2024-10-20',
    status: 'active',
    loyaltyPoints: 456,
    notes: 'Kozmetik ürünler ilgi alanı',
  },
];

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(SAMPLE_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
    avgOrderValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Müşteriler</h2>
          <p className="text-sm text-gray-500 mt-1">Müşteri bilgilerini ve alışveriş geçmişini görüntüleyin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Müşteri</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktif Müşteri</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Sipariş</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ort. Sipariş</p>
              <p className="text-2xl font-bold text-gray-900">₺{stats.avgOrderValue.toFixed(0)}</p>
            </div>
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
                placeholder="Müşteri adı, e-posta, telefon veya şehir ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Tüm Müşteriler</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">İletişim</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Şehir</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Sipariş</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Harcama</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Puan</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    {searchTerm || statusFilter !== 'all' ? 'Arama kriterine uygun müşteri bulunamadı.' : 'Henüz müşteri bulunmuyor.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">
                            Üye: {new Date(customer.joinDate).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-xs text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{customer.city}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{customer.totalOrders}</div>
                      <div className="text-xs text-gray-500">
                        Son: {new Date(customer.lastOrderDate).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₺{customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">{customer.loyaltyPoints}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {customer.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
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

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Müşteri Detayları</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      selectedCustomer.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedCustomer.status === 'active' ? 'Aktif Müşteri' : 'Pasif Müşteri'}
                    </span>
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium text-yellow-700">
                        {selectedCustomer.loyaltyPoints} Puan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-medium">E-posta</span>
                  </div>
                  <p className="text-sm text-gray-900">{selectedCustomer.email}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-medium">Telefon</span>
                  </div>
                  <p className="text-sm text-gray-900">{selectedCustomer.phone}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-medium">Adres</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {selectedCustomer.address}, {selectedCustomer.city}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium">Üyelik Tarihi</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedCustomer.joinDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium">Son Sipariş</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedCustomer.lastOrderDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-xs font-medium">Toplam Sipariş</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{selectedCustomer.totalOrders}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <span className="text-lg font-bold">₺</span>
                    <span className="text-xs font-medium">Toplam Harcama</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    ₺{selectedCustomer.totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-yellow-800 mb-2">Notlar</h5>
                  <p className="text-sm text-yellow-700">{selectedCustomer.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
