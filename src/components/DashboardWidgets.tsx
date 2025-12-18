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
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Satış ve İade Grafiği</h3>
          <div className="flex gap-1">
            <button
              onClick={() => setGraphView('sales')}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                graphView === 'sales'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Satış
            </button>
            <button
              onClick={() => setGraphView('returns')}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                graphView === 'returns'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              İadeler
            </button>
            <button
              onClick={() => setGraphView('both')}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
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
          <div className="flex items-center gap-3 mb-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Satış</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-orange-500 rounded"></div>
              <span className="text-gray-600">İadeler</span>
            </div>
          </div>
        )}

        <div className="h-48 flex items-end gap-1.5">
          {primary.length === 0 && secondary.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Veri bulunmuyor
            </div>
          ) : (
            primary.map((data, index) => {
              const secondaryValue = secondary.find(s => s.date === data.date);
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5">
                    {graphView === 'both' ? (
                      <>
                        <div
                          className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                          style={{ height: `${(data.amount / maxValue) * 180}px` }}
                        ></div>
                        <div
                          className="flex-1 bg-orange-500 rounded-t transition-all hover:bg-orange-600"
                          style={{ height: `${((secondaryValue?.amount || 0) / maxValue) * 180}px` }}
                        ></div>
                      </>
                    ) : (
                      <div
                        className={`w-full rounded-t transition-all ${
                          graphView === 'sales'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-orange-500 hover:bg-orange-600'
                        }`}
                        style={{ height: `${(data.amount / maxValue) * 180}px` }}
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">En Çok Satan Ürünler</h3>
        <div className="space-y-2.5">
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-xs">Henüz ürün bulunmuyor</p>
          ) : (
            topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">#{index + 1}</span>
                  <span className="text-xs text-gray-700">{product.name}</span>
                </div>
                <span className="text-xs font-semibold text-blue-600">{product.sales}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-4 text-white">
        <Eye className="w-5 h-5 mb-2 opacity-80" />
        <h3 className="text-3xl font-bold mb-1">132</h3>
        <p className="text-blue-100 text-xs">Son 5 dakikadaki aktif ziyaretçi</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Dönüşüm İstatistikleri</h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Sepete Ekleme</span>
            <span className="text-xs font-semibold text-green-600">%12.4</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Ödeme Tamamlama</span>
            <span className="text-xs font-semibold text-green-600">%8.2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">CTR</span>
            <span className="text-xs font-semibold text-blue-600">%3.7</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Trafik Kaynakları</h3>
        <div className="flex items-center justify-center mb-3">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="10"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="10"
                strokeDasharray="201.06"
                strokeDashoffset="50.27"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">75%</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Google</span>
            </div>
            <span className="font-semibold text-gray-900">45%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Sosyal Medya</span>
            </div>
            <span className="font-semibold text-gray-900">30%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Organik</span>
            </div>
            <span className="font-semibold text-gray-900">15%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Reklam</span>
            </div>
            <span className="font-semibold text-gray-900">10%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
