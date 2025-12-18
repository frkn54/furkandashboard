import { useState, useEffect, useMemo } from 'react';
import { Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateSalesData, generateReturnsData, getRandomProducts } from '../lib/mockData';

interface DashboardWidgetsProps {
  startDate: string;
  endDate: string;
}

function generateBottomCardsData(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const seed = start.getDate() + end.getDate() + diffDays;
  const multiplier = Math.max(0.5, diffDays / 7);

  const onlineUsers = Math.floor(80 + (seed * 17) % 120 + Math.random() * 50);

  const cartRate = (10 + (seed * 3) % 8 + Math.random() * 2).toFixed(1);
  const checkoutRate = (6 + (seed * 2) % 5 + Math.random() * 1.5).toFixed(1);
  const ctr = (2.5 + (seed % 4) + Math.random() * 1).toFixed(1);

  const google = 35 + (seed * 2) % 20;
  const social = 20 + (seed * 3) % 15;
  const organic = 10 + (seed % 10);
  const ads = 100 - google - social - organic;
  const totalTraffic = google + social + organic + ads;

  return {
    onlineUsers,
    conversion: { cartRate, checkoutRate, ctr },
    traffic: {
      google: Math.round((google / totalTraffic) * 100),
      social: Math.round((social / totalTraffic) * 100),
      organic: Math.round((organic / totalTraffic) * 100),
      ads: Math.round((ads / totalTraffic) * 100),
    },
  };
}

export default function DashboardWidgets({ startDate, endDate }: DashboardWidgetsProps) {
  const [salesData, setSalesData] = useState<{ date: string; amount: number }[]>([]);
  const [returnsData, setReturnsData] = useState<{ date: string; amount: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number; image_url: string }[]>([]);
  const [graphView, setGraphView] = useState<'sales' | 'returns' | 'both'>('sales');
  const { user } = useAuth();

  const bottomCardsData = useMemo(() => generateBottomCardsData(startDate, endDate), [startDate, endDate]);

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
      .select('name, image_url')
      .eq('user_id', user.id)
      .limit(5);

    if (products && products.length > 0) {
      setTopProducts(
        products.map((p, i) => ({
          name: p.name,
          sales: Math.floor(Math.random() * 100) + 10,
          image_url: p.image_url || 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
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
    <div className="space-y-[5px]">
      <div className="flex gap-[5px] h-[210px]">
        <div className="flex-[2] bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-semibold text-gray-900">Satis ve Iade Grafigi</h3>
            <div className="flex gap-0.5">
              <button
                onClick={() => setGraphView('sales')}
                className={`px-1.5 py-0.5 text-[9px] rounded font-medium transition-colors ${
                  graphView === 'sales'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Satis
              </button>
              <button
                onClick={() => setGraphView('returns')}
                className={`px-1.5 py-0.5 text-[9px] rounded font-medium transition-colors ${
                  graphView === 'returns'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Iade
              </button>
              <button
                onClick={() => setGraphView('both')}
                className={`px-1.5 py-0.5 text-[9px] rounded font-medium transition-colors ${
                  graphView === 'both'
                    ? 'bg-slate-700 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Ikisi
              </button>
            </div>
          </div>

          {graphView === 'both' && (
            <div className="flex items-center gap-2 mb-1 text-[9px]">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded"></div>
                <span className="text-gray-600">Satis</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded"></div>
                <span className="text-gray-600">Iade</span>
              </div>
            </div>
          )}

          <div className="h-[155px] flex items-end gap-1">
            {primary.length === 0 && secondary.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                Veri bulunmuyor
              </div>
            ) : (
              primary.map((data, index) => {
                const secondaryValue = secondary.find(s => s.date === data.date);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full flex items-end gap-0.5 h-[140px]">
                      {graphView === 'both' ? (
                        <>
                          <div
                            className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                            style={{ height: `${(data.amount / maxValue) * 130}px` }}
                          ></div>
                          <div
                            className="flex-1 bg-orange-500 rounded-t transition-all hover:bg-orange-600"
                            style={{ height: `${((secondaryValue?.amount || 0) / maxValue) * 130}px` }}
                          ></div>
                        </>
                      ) : (
                        <div
                          className={`w-full rounded-t transition-all ${
                            graphView === 'sales'
                              ? 'bg-blue-500 hover:bg-blue-600'
                              : 'bg-orange-500 hover:bg-orange-600'
                          }`}
                          style={{ height: `${(data.amount / maxValue) * 130}px` }}
                        ></div>
                      )}
                    </div>
                    <span className="text-[8px] text-gray-500">
                      {new Date(data.date).getDate()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <h3 className="text-[10px] font-semibold text-gray-900 mb-2">En Cok Satan Urunler</h3>
          <div className="space-y-1.5">
            {topProducts.length === 0 ? (
              <p className="text-gray-400 text-[10px]">Henuz urun yok</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-semibold text-gray-400">#{index + 1}</span>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-6 h-6 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop';
                      }}
                    />
                    <span className="text-[9px] text-gray-700 truncate max-w-[80px]">{product.name}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-blue-600">{product.sales}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[5px] h-[90px]">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-3 text-white flex items-center gap-3">
          <div className="bg-white/20 rounded-lg p-2">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{bottomCardsData.onlineUsers}</h3>
            <p className="text-blue-100 text-[10px]">Aktif ziyaretci</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col justify-center">
          <h3 className="text-[9px] font-semibold text-gray-900 mb-1.5">Donusum</h3>
          <div className="flex items-center justify-between gap-2">
            <div className="text-center flex-1">
              <span className="text-sm font-bold text-green-600">%{bottomCardsData.conversion.cartRate}</span>
              <p className="text-[8px] text-gray-500">Sepet</p>
            </div>
            <div className="w-px h-5 bg-gray-200"></div>
            <div className="text-center flex-1">
              <span className="text-sm font-bold text-green-600">%{bottomCardsData.conversion.checkoutRate}</span>
              <p className="text-[8px] text-gray-500">Odeme</p>
            </div>
            <div className="w-px h-5 bg-gray-200"></div>
            <div className="text-center flex-1">
              <span className="text-sm font-bold text-blue-600">%{bottomCardsData.conversion.ctr}</span>
              <p className="text-[8px] text-gray-500">CTR</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <div className="flex items-center gap-2 h-full">
            <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-[8px] text-gray-600">Google</span>
                <span className="text-[8px] font-semibold text-gray-900 ml-auto">{bottomCardsData.traffic.google}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0"></div>
                <span className="text-[8px] text-gray-600">Sosyal</span>
                <span className="text-[8px] font-semibold text-gray-900 ml-auto">{bottomCardsData.traffic.social}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-[8px] text-gray-600">Organik</span>
                <span className="text-[8px] font-semibold text-gray-900 ml-auto">{bottomCardsData.traffic.organic}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                <span className="text-[8px] text-gray-600">Reklam</span>
                <span className="text-[8px] font-semibold text-gray-900 ml-auto">{bottomCardsData.traffic.ads}%</span>
              </div>
            </div>
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="18" fill="none" stroke="#E5E7EB" strokeWidth="5" />
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="5"
                  strokeDasharray={`${(bottomCardsData.traffic.google / 100) * 113.1} 113.1`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-gray-900">{bottomCardsData.traffic.google}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
