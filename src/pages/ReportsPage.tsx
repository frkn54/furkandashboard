import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar, Download } from 'lucide-react';

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  profit: number;
}

interface CategoryPerformance {
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
}

const SAMPLE_SALES_DATA: SalesData[] = [
  { month: 'Ocak 2024', revenue: 45230.50, orders: 89, customers: 67 },
  { month: 'Şubat 2024', revenue: 52340.75, orders: 102, customers: 78 },
  { month: 'Mart 2024', revenue: 48920.30, orders: 95, customers: 71 },
  { month: 'Nisan 2024', revenue: 61450.80, orders: 118, customers: 92 },
  { month: 'Mayıs 2024', revenue: 58670.25, orders: 110, customers: 85 },
  { month: 'Haziran 2024', revenue: 71230.90, orders: 135, customers: 103 },
  { month: 'Temmuz 2024', revenue: 82450.40, orders: 156, customers: 118 },
  { month: 'Ağustos 2024', revenue: 77890.60, orders: 145, customers: 112 },
  { month: 'Eylül 2024', revenue: 84320.75, orders: 162, customers: 125 },
  { month: 'Ekim 2024', revenue: 92150.30, orders: 178, customers: 137 },
];

const SAMPLE_PRODUCT_PERFORMANCE: ProductPerformance[] = [
  { name: 'Kablosuz Bluetooth Kulaklık', sales: 156, revenue: 140399.44, profit: 70199.72 },
  { name: 'Organik Yeşil Çay 100gr', sales: 234, revenue: 21057.66, profit: 12857.34 },
  { name: 'Paslanmaz Çelik Termos 500ml', sales: 198, revenue: 29698.02, profit: 17816.82 },
  { name: 'Fitness Takip Bandı', sales: 145, revenue: 50748.55, profit: 24648.55 },
  { name: 'Doğal Hindistan Cevizi Yağı', sales: 189, revenue: 22678.11, profit: 13604.89 },
  { name: 'Yoga Matı Premium', sales: 134, revenue: 33498.66, profit: 18738.66 },
  { name: 'Bebek Bakım Çantası', sales: 98, revenue: 39199.02, profit: 21539.02 },
  { name: 'LED Masa Lambası', sales: 176, revenue: 35198.24, profit: 20238.24 },
  { name: 'Aromaterapi Difüzörü', sales: 167, revenue: 26718.33, profit: 15028.33 },
  { name: 'Unisex Sırt Çantası 35L', sales: 123, revenue: 40578.77, profit: 22738.77 },
];

const SAMPLE_CATEGORY_PERFORMANCE: CategoryPerformance[] = [
  { category: 'Elektronik', sales: 567, revenue: 236789.50, percentage: 28.5 },
  { category: 'Ev & Yaşam', sales: 489, revenue: 198450.75, percentage: 23.9 },
  { category: 'Spor', sales: 412, revenue: 164320.30, percentage: 19.8 },
  { category: 'Gıda', sales: 356, revenue: 112670.80, percentage: 13.6 },
  { category: 'Kozmetik', sales: 234, revenue: 78940.25, percentage: 9.5 },
  { category: 'Bebek', sales: 123, revenue: 39230.40, percentage: 4.7 },
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const totalRevenue = SAMPLE_SALES_DATA.reduce((sum, data) => sum + data.revenue, 0);
  const totalOrders = SAMPLE_SALES_DATA.reduce((sum, data) => sum + data.orders, 0);
  const totalCustomers = Math.max(...SAMPLE_SALES_DATA.map(d => d.customers));
  const avgOrderValue = totalRevenue / totalOrders;

  const currentMonth = SAMPLE_SALES_DATA[SAMPLE_SALES_DATA.length - 1];
  const previousMonth = SAMPLE_SALES_DATA[SAMPLE_SALES_DATA.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
  const ordersGrowth = ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Raporlar</h2>
          <p className="text-sm text-gray-500 mt-1">Satış ve performans analizleri</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="daily">Günlük</option>
            <option value="weekly">Haftalık</option>
            <option value="monthly">Aylık</option>
            <option value="yearly">Yıllık</option>
          </select>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium">
            <Download className="w-4 h-4" />
            Dışa Aktar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(revenueGrowth).toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Toplam Gelir</p>
            <p className="text-2xl font-bold text-gray-900">₺{totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Son 10 ay</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {ordersGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(ordersGrowth).toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Toplam Sipariş</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-xs text-gray-400 mt-1">Son 10 ay</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Aktif Müşteri</p>
            <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            <p className="text-xs text-gray-400 mt-1">Bu ay</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ort. Sipariş Değeri</p>
            <p className="text-2xl font-bold text-gray-900">₺{avgOrderValue.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Son 10 ay</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Aylık Gelir Trendi</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {SAMPLE_SALES_DATA.slice(-6).map((data, index) => {
              const maxRevenue = Math.max(...SAMPLE_SALES_DATA.map(d => d.revenue));
              const width = (data.revenue / maxRevenue) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">{data.month}</span>
                    <span className="font-semibold text-gray-900">₺{data.revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Kategori Performansı</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {SAMPLE_CATEGORY_PERFORMANCE.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500', 'bg-orange-500'][index]
                    }`} />
                    <span className="text-gray-700">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{category.sales} adet</span>
                    <span className="font-semibold text-gray-900">₺{category.revenue.toFixed(0)}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500', 'bg-orange-500'][index]
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">En Çok Satan Ürünler</h3>
          <p className="text-sm text-gray-500 mt-1">Son 10 ayın performans verileri</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Satış Adedi</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Gelir</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Kar</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Kar Marjı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {SAMPLE_PRODUCT_PERFORMANCE.map((product, index) => {
                const profitMargin = (product.profit / product.revenue) * 100;
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {product.sales}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      ₺{product.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">
                      ₺{product.profit.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        profitMargin >= 50 ? 'bg-green-100 text-green-700' :
                        profitMargin >= 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        %{profitMargin.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
