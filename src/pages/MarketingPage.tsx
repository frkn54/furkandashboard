import { useState } from 'react';
import { Megaphone, Mail, MessageSquare, Gift, Users, TrendingUp, Eye, Edit, Play, Pause } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'discount';
  status: 'active' | 'paused' | 'completed' | 'scheduled';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  reach: number;
  conversions: number;
  conversionRate: number;
  description: string;
}

const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Sonbahar İndirimi 2024',
    type: 'email',
    status: 'active',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    budget: 5000,
    spent: 3250,
    reach: 12450,
    conversions: 487,
    conversionRate: 3.91,
    description: 'Tüm kategorilerde %30\'a varan indirim kampanyası',
  },
  {
    id: '2',
    name: 'SMS Flaş Kampanya',
    type: 'sms',
    status: 'active',
    startDate: '2024-10-15',
    endDate: '2024-10-25',
    budget: 2500,
    spent: 1800,
    reach: 8900,
    conversions: 356,
    conversionRate: 4.00,
    description: '24 saatlik özel flaş indirim duyurusu',
  },
  {
    id: '3',
    name: 'Sosyal Medya Marka Bilinirliği',
    type: 'social',
    status: 'active',
    startDate: '2024-10-10',
    endDate: '2024-11-10',
    budget: 8000,
    spent: 4500,
    reach: 45600,
    conversions: 892,
    conversionRate: 1.96,
    description: 'Instagram ve Facebook\'ta marka tanıtım kampanyası',
  },
  {
    id: '4',
    name: 'Yeni Müşteri Hoş Geldin',
    type: 'discount',
    status: 'active',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    budget: 10000,
    spent: 6780,
    reach: 3450,
    conversions: 1243,
    conversionRate: 36.03,
    description: 'İlk alışverişte %20 indirim kuponu',
  },
  {
    id: '5',
    name: 'Yaz Sonu Fırsatları',
    type: 'email',
    status: 'completed',
    startDate: '2024-08-15',
    endDate: '2024-09-15',
    budget: 6000,
    spent: 5890,
    reach: 15600,
    conversions: 678,
    conversionRate: 4.35,
    description: 'Yaz ürünlerinde stok tasfiye kampanyası',
  },
  {
    id: '6',
    name: 'Black Friday Hazırlık',
    type: 'email',
    status: 'scheduled',
    startDate: '2024-11-20',
    endDate: '2024-11-30',
    budget: 15000,
    spent: 0,
    reach: 0,
    conversions: 0,
    conversionRate: 0,
    description: 'Black Friday özel kampanya duyurusu',
  },
  {
    id: '7',
    name: 'Sadakat Programı Lansmanı',
    type: 'social',
    status: 'paused',
    startDate: '2024-09-20',
    endDate: '2024-10-20',
    budget: 4000,
    spent: 2100,
    reach: 18900,
    conversions: 432,
    conversionRate: 2.29,
    description: 'Yeni sadakat programı tanıtımı ve üye kazanımı',
  },
  {
    id: '8',
    name: 'Doğum Günü Özel İndirimi',
    type: 'sms',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 3000,
    spent: 2456,
    reach: 1234,
    conversions: 789,
    conversionRate: 63.93,
    description: 'Müşterilere doğum günü haftasında özel %25 indirim',
  },
];

export default function MarketingPage() {
  const [campaigns] = useState<Campaign[]>(SAMPLE_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-blue-100 text-blue-700',
    };
    const labels = {
      active: 'Aktif',
      paused: 'Duraklatıldı',
      completed: 'Tamamlandı',
      scheduled: 'Planlandı',
    };
    return (
      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      social: Users,
      discount: Gift,
    };
    const Icon = icons[type as keyof typeof icons];
    return <Icon className="w-5 h-5" />;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      email: 'E-posta',
      sms: 'SMS',
      social: 'Sosyal Medya',
      discount: 'İndirim',
    };
    return labels[type as keyof typeof labels];
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    statusFilter === 'all' || campaign.status === statusFilter
  );

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalReach: campaigns.reduce((sum, c) => sum + c.reach, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
  };

  const avgConversionRate = (stats.totalConversions / stats.totalReach) * 100;
  const budgetUsage = (stats.totalSpent / stats.totalBudget) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pazarlama Kampanyaları</h2>
          <p className="text-sm text-gray-500 mt-1">Kampanyalarınızı yönetin ve performanslarını izleyin</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-full transition-all transform hover:scale-105 font-medium text-sm">
          <Megaphone className="w-4 h-4" />
          Yeni Kampanya
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Kampanya</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <span className="text-green-600 font-medium">{stats.active} aktif</span> kampanya
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Erişim</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReach.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Ortalama <span className="font-medium">{(stats.totalReach / stats.total).toFixed(0)}</span> / kampanya
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dönüşüm</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConversions}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <span className="text-green-600 font-medium">%{avgConversionRate.toFixed(2)}</span> oran
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">₺</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bütçe Kullanımı</p>
              <p className="text-2xl font-bold text-gray-900">%{budgetUsage.toFixed(0)}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            ₺{stats.totalSpent.toFixed(0)} / ₺{stats.totalBudget.toFixed(0)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Tüm Kampanyalar</option>
            <option value="active">Aktif</option>
            <option value="paused">Duraklatıldı</option>
            <option value="completed">Tamamlandı</option>
            <option value="scheduled">Planlandı</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredCampaigns.map((campaign) => {
            const progressPercentage = (campaign.spent / campaign.budget) * 100;
            return (
              <div
                key={campaign.id}
                className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      campaign.type === 'email' ? 'bg-blue-100 text-blue-600' :
                      campaign.type === 'sms' ? 'bg-green-100 text-green-600' :
                      campaign.type === 'social' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {getTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{getTypeLabel(campaign.type)}</p>
                      {getStatusBadge(campaign.status)}
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">{campaign.name}</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tarih</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(campaign.startDate).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })} -
                      {new Date(campaign.endDate).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Erişim</span>
                    <span className="text-gray-900 font-medium">{campaign.reach.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Dönüşüm</span>
                    <span className="text-green-600 font-medium">
                      {campaign.conversions} (%{campaign.conversionRate.toFixed(2)})
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500">Bütçe Kullanımı</span>
                    <span className="text-gray-900 font-medium">
                      ₺{campaign.spent} / ₺{campaign.budget}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        progressPercentage > 90 ? 'bg-red-500' :
                        progressPercentage > 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Düzenle
                  </button>
                  <button className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                    campaign.status === 'active'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}>
                    {campaign.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Durdur
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Başlat
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Kampanya Detayları</h3>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  selectedCampaign.type === 'email' ? 'bg-blue-100 text-blue-600' :
                  selectedCampaign.type === 'sms' ? 'bg-green-100 text-green-600' :
                  selectedCampaign.type === 'social' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {getTypeIcon(selectedCampaign.type)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{selectedCampaign.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{getTypeLabel(selectedCampaign.type)}</span>
                    {getStatusBadge(selectedCampaign.status)}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{selectedCampaign.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Eye className="w-5 h-5" />
                    <span className="text-sm font-medium">Erişim</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{selectedCampaign.reach.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">Kişiye ulaşıldı</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">Dönüşüm</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{selectedCampaign.conversions}</p>
                  <p className="text-xs text-green-600 mt-1">%{selectedCampaign.conversionRate.toFixed(2)} oran</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Bütçe Kullanımı</span>
                  <span className="text-sm text-gray-600">
                    ₺{selectedCampaign.spent.toFixed(2)} / ₺{selectedCampaign.budget.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${Math.min((selectedCampaign.spent / selectedCampaign.budget) * 100, 100)}%` }}
                  >
                    {((selectedCampaign.spent / selectedCampaign.budget) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Başlangıç Tarihi</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedCampaign.startDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bitiş Tarihi</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedCampaign.endDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
