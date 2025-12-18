import { DollarSign, ShoppingCart, Package, TrendingDown, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface KPICardsProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function KPICards({ startDate, endDate, onStartDateChange, onEndDateChange }: KPICardsProps) {
  const [stats, setStats] = useState({
    totalSales: 0,
    netSales: 0,
    orderCount: 0,
    returnRate: 0,
    pendingShipments: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, startDate, endDate]);

  const loadStats = async () => {
    if (!user) return;

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .gte('order_date', startDate)
      .lte('order_date', endDate + 'T23:59:59');

    if (error) {
      console.error('Error loading stats:', error);
      return;
    }

    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    const completedOrders = orders.filter((o) => o.status === 'completed');
    const returnedOrders = orders.filter((o) => o.status === 'returned');
    const pendingOrders = orders.filter((o) => o.status === 'pending');

    const netSales = completedOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    const returnRate = orders.length > 0 ? (returnedOrders.length / orders.length) * 100 : 0;

    setStats({
      totalSales,
      netSales,
      orderCount: orders.length,
      returnRate,
      pendingShipments: pendingOrders.length,
    });
  };

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };

  const cards = [
    {
      title: 'Toplam Satış',
      value: `₺${stats.totalSales.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
      color: 'from-blue-500 to-blue-600',
      icon: DollarSign,
    },
    {
      title: 'Net Satış',
      value: `₺${stats.netSales.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
      color: 'from-green-500 to-green-600',
      icon: DollarSign,
    },
    {
      title: 'Sipariş Sayısı',
      value: stats.orderCount.toString(),
      color: 'from-slate-500 to-slate-600',
      icon: ShoppingCart,
    },
    {
      title: 'İade Sayısı',
      value: `%${stats.returnRate.toFixed(1)}`,
      color: 'from-orange-500 to-orange-600',
      icon: TrendingDown,
    },
    {
      title: 'Gönderilecek Siparişler',
      value: stats.pendingShipments.toString(),
      color: 'from-rose-500 to-rose-600',
      icon: Truck,
    },
  ];

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700 px-1">Temel Metrikler</h3>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-1 ml-2">
            {[
              { label: 'Bugün', days: 0 },
              { label: '7 Gün', days: 7 },
              { label: '30 Gün', days: 30 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset.days)}
                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-transform hover:scale-105"
          >
            <div className={`h-1.5 bg-gradient-to-r ${card.color}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <card.icon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{card.value}</h3>
              <p className="text-sm text-gray-500">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
