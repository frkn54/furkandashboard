import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateSalesData, generateReturnsData, getRandomProducts } from '../lib/mockData';

interface DashboardWidgetsProps {
  startDate: string;
  endDate: string;
}

export default function DashboardWidgets({ startDate, endDate }: DashboardWidgetsProps) {
  const [salesData, setSalesData] = useState<{ date: string; amount: number }[]>([]);
  const [returnsData, setReturnsData] = useState<{ date: string; amount: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number }[]>([]);
  const [graphView, setGraphView] = useState<'sales' | 'returns' | 'both'>('sales');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, startDate, endDate]);

  const loadData = async () => {
    if (!user) return;

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('order_date', startDate)
      .lte('order_date', endDate + 'T23:59:59')
      .order('order_date', { ascending: true });

    if (orders && orders.length > 0) {
      const dailySales: Record<string, number> = {};
      orders.forEach((order) => {
        const date = order.order_date.split('T')[0];
        dailySales[date] = (dailySales[date] || 0) + parseFloat(order.total_amount || 0);
      });

      setSalesData(
        Object.entries(dailySales).map(([date, amount]) => ({ date, amount }))
      );
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setSalesData(generateSalesData(diffDays));
    }

    const { data: returnedOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'returned')
      .gte('order_date', startDate)
      .lte('order_date', endDate + 'T23:59:59')
      .order('order_date', { ascending: true });

    if (returnedOrders && returnedOrders.length > 0) {
      const dailyReturns: Record<string, number> = {};
      returnedOrders.forEach((order) => {
        const date = order.order_date.split('T')[0];
        dailyReturns[date] = (dailyReturns[date] || 0) + parseFloat(order.total_amount || 0);
      });

      setReturnsData(
        Object.entries(dailyReturns).map(([date, amount]) => ({ date, amount }))
      );
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setReturnsData(generateReturnsData(diffDays));
    }

    const { data: products } = await supabase
      .from('products')
      .select('name')
      .eq('user_id', user.id)
      .limit(5);

    if (products && products.length > 0) {
      setTopProducts(
        products.map((p, i) => ({
          name: p.name,
          sales: Math.floor(Math.random() * 100) + 10,
        }))
      );
    } else {
      setTopProducts(getRandomProducts(5));
    }
  };

  const getMaxValue = () => {
    const salesMax = Math.max(...salesData.map((d) => d.amount), 1);
    const returnsMax = Math.max(...returnsData.map((d) => d.amount), 1);
    return Math.max(salesMax, returnsMax, 1);
  };

  const maxValue = getMaxValue();

  const getDataForView = () => {
    if (graphView === 'sales') return { primary: salesData, secondary: [] };
    if (graphView === 'returns') return { primary: returnsData, secondary: [] };
    return { primary: salesData, secondary: returnsData };
  };

  const { primary, secondary } = getDataForView();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Satış ve İade Grafiği</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setGraphView('sales')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                graphView === 'sales'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Satış
            </button>
            <button
              onClick={() => setGraphView('returns')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                graphView === 'returns'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              İadeler
            </button>
            <button
              onClick={() => setGraphView('both')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                graphView === 'both'
                  ? 'bg-slate-700 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Her İkisi
            </button>
          </div>
        </div>

        {graphView === 'both' && (
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Satış</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-600">İadeler</span>
            </div>
          </div>
        )}

        <div className="h-64 flex items-end gap-2">
          {primary.length === 0 && secondary.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Veri bulunmuyor
            </div>
          ) : (
            primary.map((data, index) => {
              const secondaryValue = secondary.find(s => s.date === data.date);
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end gap-0.5">
                    {graphView === 'both' ? (
                      <>
                        <div
                          className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${(data.amount / maxValue) * 240}px` }}
                        ></div>
                        <div
                          className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-orange-500"
                          style={{ height: `${((secondaryValue?.amount || 0) / maxValue) * 240}px` }}
                        ></div>
                      </>
                    ) : (
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          graphView === 'sales'
                            ? 'bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500'
                            : 'bg-gradient-to-t from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500'
                        }`}
                        style={{ height: `${(data.amount / maxValue) * 240}px` }}
                      ></div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(data.date).getDate()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">En Çok Satan Ürünler</h3>
        <div className="space-y-4">
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">Henüz ürün bulunmuyor</p>
          ) : (
            topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                  <span className="text-sm text-gray-700">{product.name}</span>
                </div>
                <span className="text-sm font-medium text-blue-600">{product.sales}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-sm p-6 text-white">
        <Eye className="w-8 h-8 mb-4 opacity-80" />
        <h3 className="text-4xl font-bold mb-2">132</h3>
        <p className="text-blue-100 text-sm">Son 5 dakikadaki aktif ziyaretçi</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Dönüşüm İstatistikleri</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sepete Ekleme</span>
            <span className="text-sm font-bold text-green-600">%12.4</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Ödeme Tamamlama</span>
            <span className="text-sm font-bold text-green-600">%8.2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">CTR</span>
            <span className="text-sm font-bold text-blue-600">%3.7</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Trafik Kaynakları</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="16"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="16"
                strokeDasharray="351.86"
                strokeDashoffset="87.96"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">75%</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Google</span>
            </div>
            <span className="font-medium text-gray-900">45%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Sosyal Medya</span>
            </div>
            <span className="font-medium text-gray-900">30%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Organik</span>
            </div>
            <span className="font-medium text-gray-900">15%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Reklam</span>
            </div>
            <span className="font-medium text-gray-900">10%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
