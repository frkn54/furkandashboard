import { DollarSign, ShoppingCart, Package, TrendingDown, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface KPICardsProps {
  startDate: string;
  endDate: string;
}

export default function KPICards({ startDate, endDate }: KPICardsProps) {
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
      color: 'from-purple-500 to-purple-600',
      icon: ShoppingCart,
    },
    {
      title: 'İade Oranı',
      value: `%${stats.returnRate.toFixed(1)}`,
      color: 'from-orange-500 to-orange-600',
      icon: TrendingDown,
    },
    {
      title: 'Gönderilecek Siparişler',
      value: stats.pendingShipments.toString(),
      color: 'from-red-500 to-red-600',
      icon: Truck,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
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
  );
}
