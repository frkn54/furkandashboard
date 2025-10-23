import { useState, useEffect } from 'react';
import {
  Package, ShoppingCart, Users, Share2, Search, TrendingUp, DollarSign,
  Megaphone, Tag, Gift, FileText, Award, Store, Globe, CreditCard,
  Wallet, Calculator, ShoppingBag, Truck, Banknote, Flag, Newspaper,
  Lightbulb, FileImage, Settings, ChevronDown, ChevronRight, Home, User, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  subItems?: { id: string; label: string }[];
}

const menuItems: MenuItem[] = [
  {
    id: 'products',
    label: 'Ürünler',
    icon: Package,
    subItems: [
      { id: 'products-list', label: 'Ürünler sayfası' },
      { id: 'products-stock', label: 'Stok sayısı' },
      { id: 'products-barcode', label: 'Ürün barkot' },
      { id: 'products-feedback', label: 'Şikayet ve öneri kutusu' },
      { id: 'products-target', label: 'Ürün hedef kitle ve anahtar kelime' },
      { id: 'products-profit', label: 'Ürün karlılık hesabı' },
    ],
  },
  {
    id: 'orders',
    label: 'Siparişler',
    icon: ShoppingCart,
    subItems: [
      { id: 'orders-list', label: 'Siparişler' },
      { id: 'orders-returns', label: 'İadeler' },
      { id: 'orders-favorites', label: 'Favorilenenler' },
      { id: 'orders-abandoned', label: 'Terk edilmiş sepetler' },
      { id: 'orders-followup', label: 'Sipariş sonrası arama dönüşüm' },
    ],
  },
  {
    id: 'customers',
    label: 'Müşteriler',
    icon: Users,
    subItems: [
      { id: 'customers-info', label: 'Bilgiler' },
      { id: 'customers-chat', label: 'Sohbet geçmişi' },
      { id: 'customers-activity', label: 'Satın alma ve etkileşimleri' },
    ],
  },
  {
    id: 'social',
    label: 'Sosyal Medya',
    icon: Share2,
    subItems: [
      { id: 'social-posts', label: 'Paylaşımlar' },
      { id: 'social-engagement', label: 'Etkileşimler' },
      { id: 'social-messages', label: 'Mesajlar' },
    ],
  },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'advertising', label: 'Reklam', icon: TrendingUp },
  {
    id: 'sales',
    label: 'Satış',
    icon: DollarSign,
  },
  {
    id: 'marketing',
    label: 'Pazarlama',
    icon: Megaphone,
    subItems: [
      { id: 'marketing-contests', label: 'Yarışmalar' },
      { id: 'marketing-giftcard', label: 'Hediye kartı' },
      { id: 'marketing-sms', label: 'Toplu SMS atma' },
      { id: 'marketing-call', label: 'Arama' },
    ],
  },
  { id: 'discount', label: 'İndirim', icon: Tag },
  {
    id: 'campaigns',
    label: 'Kampanyalar',
    icon: Gift,
    subItems: [
      { id: 'campaigns-coupons', label: 'Kuponlar' },
      { id: 'campaigns-draws', label: 'Çekilişler' },
      { id: 'campaigns-methods', label: 'Kampanya yöntemleri' },
    ],
  },
  { id: 'reports', label: 'Raporlar', icon: FileText },
  {
    id: 'brand',
    label: 'Marka Yönetimi',
    icon: Award,
    subItems: [
      { id: 'brand-positioning', label: 'Konumlandırma' },
      { id: 'brand-identity', label: 'Marka kimliği' },
      { id: 'brand-awareness', label: 'Marka bilinirliği' },
      { id: 'brand-image', label: 'Marka imajı' },
      { id: 'brand-feedback', label: 'Öneri ve şikayetler' },
      { id: 'brand-packaging', label: 'Paketlemeler' },
      { id: 'brand-influencer', label: 'Influencer yaratma' },
    ],
  },
  {
    id: 'marketplaces',
    label: 'Pazar Yerleri',
    icon: Store,
    subItems: [
      { id: 'marketplace-trendyol', label: 'Trendyol' },
      { id: 'marketplace-n11', label: 'N11' },
      { id: 'marketplace-hepsiburada', label: 'Hepsiburada' },
      { id: 'marketplace-amazon', label: 'Amazon' },
      { id: 'marketplace-etsy', label: 'Etsy' },
      { id: 'marketplace-ozon', label: 'Ozon' },
    ],
  },
  { id: 'sales-channels', label: 'Satış Kanalları', icon: TrendingUp },
  { id: 'website', label: 'Web Site', icon: Globe },
  { id: 'finance', label: 'Finans', icon: CreditCard },
  {
    id: 'accounting',
    label: 'Muhasebe',
    icon: Calculator,
    subItems: [
      { id: 'accounting-invoices', label: 'Kesilen faturalar' },
      { id: 'accounting-taxes', label: 'Vergiler' },
      { id: 'accounting-income-tax', label: '3 aylık, 6 aylık, 1 yıllık gelir vergisi' },
      { id: 'accounting-budget', label: 'Şirket bütçe değeri' },
      { id: 'accounting-vat', label: 'KDV ve vergi ödeme bilgileri' },
      { id: 'accounting-suggestions', label: 'Vergiden kaçınma önerileri alanı' },
    ],
  },
  { id: 'purchasing', label: 'Satın Alma', icon: ShoppingBag },
  { id: 'cargo', label: 'Kargo', icon: Truck },
  { id: 'payment-systems', label: 'Ödeme Sistemleri', icon: Wallet },
  { id: 'export', label: 'İhracat', icon: Flag },
  { id: 'news', label: 'Haberler', icon: Newspaper },
  { id: 'apps', label: 'Uygulamalar', icon: Globe },
  { id: 'rnd', label: 'AR-GE', icon: Lightbulb },
  { id: 'converter', label: 'WebP ve WebM Format Dönüştürücü', icon: FileImage },
  {
    id: 'settings',
    label: 'Ayarlar',
    icon: Settings,
    subItems: [
      { id: 'settings-profile', label: 'Profilim' },
    ],
  },
];

interface SidebarProps {
  activePage: string;
  onPageChange: (pageId: string) => void;
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(activePage !== 'dashboard');
  const { signOut } = useAuth();

  const shouldBeCollapsed = activePage !== 'dashboard';

  useEffect(() => {
    setIsCollapsed(shouldBeCollapsed);
  }, [activePage, shouldBeCollapsed]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <aside
      className={`bg-white h-screen overflow-y-auto overflow-x-hidden scrollbar-hide border-r border-gray-200 fixed left-0 top-0 transition-all duration-300 z-50 shadow-lg ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      onMouseEnter={() => shouldBeCollapsed && setIsCollapsed(false)}
      onMouseLeave={() => shouldBeCollapsed && setIsCollapsed(true)}
    >
      <div className={`transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-6'}`}>
        <button
          onClick={() => onPageChange('dashboard')}
          className={`flex items-center gap-3 mb-8 w-full hover:opacity-80 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isCollapsed ? 'w-12 h-12' : 'w-10 h-10'
          }`}>
            <Package className={`text-white transition-all duration-300 ${
              isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
            }`} />
          </div>
          <div className={`text-left transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}>
            <h1 className="font-bold text-gray-900 whitespace-nowrap">E-Ticaret</h1>
            <p className="text-xs text-gray-500 whitespace-nowrap">Yönetim Paneli</p>
          </div>
        </button>

        <nav className="space-y-1">
          <button
            onClick={() => onPageChange('dashboard')}
            className={`w-full flex items-center gap-3 rounded-xl transition-all mb-2 ${
              isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'
            } ${
              activePage === 'dashboard'
                ? 'bg-blue-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home className={`flex-shrink-0 transition-all duration-300 ${
              isCollapsed ? 'w-6 h-6' : 'w-4 h-4'
            }`} />
            <span className={`text-sm transition-opacity duration-300 whitespace-nowrap ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>Dashboard</span>
          </button>

          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.subItems) {
                    toggleExpand(item.id);
                  } else {
                    onPageChange(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between rounded-xl transition-all ${
                  isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'
                } ${
                  activePage === item.id
                    ? 'bg-blue-500 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <item.icon className={`flex-shrink-0 transition-all duration-300 ${
                    isCollapsed ? 'w-6 h-6' : 'w-4 h-4'
                  }`} />
                  <span className={`text-sm transition-opacity duration-300 whitespace-nowrap ${
                    isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  }`}>{item.label}</span>
                </div>
                {item.subItems && !isCollapsed && (
                  expandedItems.includes(item.id) ? (
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )
                )}
              </button>

              {item.subItems && expandedItems.includes(item.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onPageChange(subItem.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activePage === subItem.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className={`mt-auto pt-4 border-t border-gray-200 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-0'}`}>
          <button
            onClick={async () => {
              try {
                await signOut();
              } catch (error) {
                console.error('Logout error:', error);
              }
            }}
            className={`w-full flex items-center gap-3 rounded-xl transition-all text-red-600 hover:bg-red-50 ${
              isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'
            }`}
          >
            <LogOut className={`flex-shrink-0 transition-all duration-300 ${
              isCollapsed ? 'w-6 h-6' : 'w-4 h-4'
            }`} />
            <span className={`text-sm font-medium transition-opacity duration-300 whitespace-nowrap ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
