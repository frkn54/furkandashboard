import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, X, CreditCard as Edit2, Trash2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CashFlowEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  note: string;
}

interface CashFlowTimelineProps {
  onPageChange?: (page: string) => void;
}

interface EconomicData {
  usdTry: string;
  goldOz: string;
  btcUsd: string;
  silverOz: string;
  interestRate: string;
  inflation: string;
  bist100: string;
}

export default function CashFlowTimeline({ onPageChange }: CashFlowTimelineProps = {}) {
  const [showModal, setShowModal] = useState(false);
  const [showEntriesModal, setShowEntriesModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  const [modalAmount, setModalAmount] = useState('');
  const [modalNote, setModalNote] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [cashFlowData, setCashFlowData] = useState<Record<string, CashFlowEntry[]>>({});
  const [economicData, setEconomicData] = useState<EconomicData>({
    usdTry: '34.85',
    goldOz: '2,648',
    btcUsd: '106,420',
    silverOz: '30.52',
    interestRate: '%50',
    inflation: '%47.1',
    bist100: '289',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchEconomicData();
  }, []);

  const fetchEconomicData = async () => {
    try {
      const [forexRes, cryptoRes] = await Promise.all([
        fetch('https://api.exchangerate-api.com/v4/latest/USD'),
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'),
      ]);

      if (forexRes.ok) {
        const forexData = await forexRes.json();
        const usdTry = forexData.rates?.TRY?.toFixed(2) || '34.85';
        setEconomicData(prev => ({ ...prev, usdTry }));
      }

      if (cryptoRes.ok) {
        const cryptoData = await cryptoRes.json();
        const btcUsd = cryptoData.bitcoin?.usd?.toLocaleString('en-US') || '106,420';
        setEconomicData(prev => ({ ...prev, btcUsd }));
      }
    } catch (error) {
      console.log('Economic data fetch error, using defaults');
    }
  };

  useEffect(() => {
    if (user) {
      loadCashFlow();
    }
  }, [user]);

  const loadCashFlow = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('cash_flow')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', getLast35DaysRange().start)
      .lte('date', getLast35DaysRange().end)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error loading cash flow:', error);
      return;
    }

    const flowMap: Record<string, CashFlowEntry[]> = {};
    data.forEach((entry) => {
      if (!flowMap[entry.date]) {
        flowMap[entry.date] = [];
      }
      flowMap[entry.date].push({
        id: entry.id,
        date: entry.date,
        type: entry.type,
        amount: parseFloat(entry.amount),
        note: entry.note,
      });
    });

    setCashFlowData(flowMap);
  };

  const getLast35DaysRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 3);
    const end = new Date(today);
    end.setDate(today.getDate() + 31);

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const generate35Days = () => {
    const days = [];
    const today = new Date();

    for (let i = -3; i <= 31; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayNum: date.getDate(),
        isToday: i === 0,
        isPast: i < 0,
      });
    }

    return days;
  };

  const getCurrentMonthName = () => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[new Date().getMonth()];
  };

  const getCurrentQuarterInfo = () => {
    const today = new Date();
    const month = today.getMonth();
    const quarter = Math.floor(month / 3) + 1;

    const quarterStartMonth = (quarter - 1) * 3;
    const quarterStart = new Date(today.getFullYear(), quarterStartMonth, 1);
    const quarterEnd = new Date(today.getFullYear(), quarterStartMonth + 3, 0);

    const totalDays = Math.floor((quarterEnd.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysPassed = Math.floor((today.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const percentage = Math.round((daysPassed / totalDays) * 100);

    return `${quarter}.Çeyrek (${percentage}%)`;
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const entries = cashFlowData[dateStr];
    if (entries && entries.length > 0) {
      setShowEntriesModal(true);
    } else {
      openAddModal(dateStr);
    }
  };

  const openAddModal = (dateStr: string) => {
    setSelectedDate(dateStr);
    setEditingEntryId(null);
    setModalAmount('');
    setModalNote('');
    setModalType('income');
    setShowModal(true);
    setShowEntriesModal(false);
  };

  const openEditModal = (entry: CashFlowEntry) => {
    setSelectedDate(entry.date);
    setEditingEntryId(entry.id);
    setModalAmount(entry.amount.toString());
    setModalNote(entry.note);
    setModalType(entry.type);
    setShowModal(true);
    setShowEntriesModal(false);
  };

  const handleSave = async () => {
    if (!user || !modalAmount || !selectedDate) return;

    if (editingEntryId) {
      const { error } = await supabase
        .from('cash_flow')
        .update({
          type: modalType,
          amount: parseFloat(modalAmount),
          note: modalNote,
        })
        .eq('id', editingEntryId);

      if (error) {
        console.error('Error updating cash flow:', error);
        return;
      }
    } else {
      const { error } = await supabase.from('cash_flow').insert([
        {
          user_id: user.id,
          date: selectedDate,
          type: modalType,
          amount: parseFloat(modalAmount),
          note: modalNote,
        },
      ]);

      if (error) {
        console.error('Error saving cash flow:', error);
        return;
      }
    }

    await loadCashFlow();
    setShowModal(false);
    setEditingEntryId(null);
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) return;

    const { error } = await supabase
      .from('cash_flow')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Error deleting cash flow:', error);
      return;
    }

    await loadCashFlow();
    const entries = cashFlowData[selectedDate];
    if (!entries || entries.length <= 1) {
      setShowEntriesModal(false);
    }
  };

  const days = generate35Days();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 h-[90px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange?.('finance-cashflow')}
            className="px-2 py-1 text-[10px] text-gray-600 hover:bg-gray-100 rounded-md transition-colors font-medium border border-gray-200"
          >
            Tum Zamanlar
          </button>
          <span className="text-[10px] font-semibold text-gray-700">
            {getCurrentQuarterInfo()}
          </span>
          <span className="text-[10px] font-bold text-gray-900">
            {getCurrentMonthName()}
          </span>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-gray-600">USD/TRY: <span className="font-semibold text-gray-900">{economicData.usdTry}</span></span>
            <span className="text-gray-600">Altin: <span className="font-semibold text-gray-900">${economicData.goldOz}</span></span>
            <span className="text-gray-600">BTC: <span className="font-semibold text-gray-900">${economicData.btcUsd}</span></span>
            <span className="text-gray-600">Gumus: <span className="font-semibold text-gray-900">${economicData.silverOz}</span></span>
            <span className="text-gray-600">Faiz: <span className="font-semibold text-gray-900">{economicData.interestRate}</span></span>
            <span className="text-gray-600">Enf: <span className="font-semibold text-gray-900">{economicData.inflation}</span></span>
            <span className="text-gray-600">BIST: <span className="font-semibold text-gray-900">${economicData.bist100}</span></span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 h-[42px]">
        {days.map((day) => {
          const entries = cashFlowData[day.date] || [];
          const hasIncome = entries.some(e => e.type === 'income');
          const hasExpense = entries.some(e => e.type === 'expense');
          const hasBoth = hasIncome && hasExpense;

          return (
            <button
              key={day.date}
              onClick={() => handleDayClick(day.date)}
              className={`flex-1 rounded-md border transition-all hover:scale-105 ${
                day.isToday
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : hasBoth
                  ? 'border-blue-400 bg-blue-50'
                  : hasIncome
                  ? 'border-green-500 bg-green-50'
                  : hasExpense
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
              title={`${day.dayNum} - ${entries.length > 0 ? `${entries.length} islem` : 'Islem yok'}`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={`text-[10px] font-bold ${
                  day.isToday ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {day.dayNum}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {showEntriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDate} - İşlemler
              </h3>
              <button onClick={() => setShowEntriesModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {cashFlowData[selectedDate]?.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-lg border-2 ${
                    entry.type === 'income'
                      ? 'border-green-200 bg-green-50'
                      : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {entry.type === 'income' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-orange-600" />
                        )}
                        <span className={`text-sm font-semibold ${
                          entry.type === 'income' ? 'text-green-700' : 'text-orange-700'
                        }`}>
                          {entry.type === 'income' ? 'Para Girişi' : 'Para Çıkışı'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-1">
                        {entry.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                      </p>
                      {entry.note && (
                        <p className="text-sm text-gray-600">{entry.note}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(entry)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => openAddModal(selectedDate)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all"
            >
              <Plus className="w-5 h-5" />
              Yeni İşlem Ekle
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingEntryId ? 'İşlemi Düzenle' : 'Nakit Akışı Ekle'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İşlem Tipi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setModalType('income')}
                    className={`py-2 px-4 rounded-lg border-2 transition-all ${
                      modalType === 'income'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Para Girişi
                  </button>
                  <button
                    onClick={() => setModalType('expense')}
                    className={`py-2 px-4 rounded-lg border-2 transition-all ${
                      modalType === 'expense'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Para Çıkışı
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutar</label>
                <input
                  type="number"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Not</label>
                <textarea
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="Açıklama ekleyin..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg font-medium transition-all"
              >
                {editingEntryId ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
