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
    id: 'product-management',
    label: 'Ürün Yönetimi',
    icon: Package,
    subItems: [
      { id: 'products', label: 'Ürünler' },
      { id: 'products-stock', label: 'Stok Takibi' },
      { id: 'products-feedback', label: 'Şikayet ve Öneri Kutusu' },
      { id: 'products-target', label: 'Ürün Hedef Kitle ve Anahtar Kelime' },
      { id: 'products-profit', label: 'Ürün Karlılık Analizi' },
    ],
  },
  {
    id: 'order-management',
    label: 'Sipariş Yönetimi',
    icon: ShoppingCart,
    subItems: [
      { id: 'orders', label: 'Siparişler' },
      { id: 'orders-returns', label: 'İadeler' },
      { id: 'orders-favorites', label: 'Favorilenen Ürünler' },
      { id: 'orders-abandoned', label: 'Terk Edilmiş Sepetler' },
      { id: 'orders-followup', label: 'Sipariş Sonrası Arama Dönüşümü' },
    ],
  },
  {
    id: 'customer-crm',
    label: 'Müşteri ve CRM',
    icon: Users,
    subItems: [
      { id: 'customers', label: 'Müşteri Bilgileri' },
      { id: 'customers-history', label: 'Satın Alma Geçmişi' },
      { id: 'customers-analysis', label: 'Etkileşim ve Davranış Analizi' },
      { id: 'customers-chat', label: 'Sohbet Geçmişi' },
    ],
  },
  {
    id: 'brand-management',
    label: 'Marka Yönetimi',
    icon: Award,
    subItems: [
      { id: 'brand-positioning', label: 'Marka Konumlandırma' },
      { id: 'brand-identity', label: 'Marka Kimliği' },
      { id: 'brand-awareness', label: 'Marka Bilinirliği' },
      { id: 'brand-image', label: 'Marka İmajı' },
      { id: 'brand-feedback', label: 'Öneri ve Şikayet Yönetimi' },
      { id: 'brand-influencer', label: 'Influencer Oluşturma ve Yönetme' },
    ],
  },
  {
    id: 'marketing',
    label: 'Pazarlama',
    icon: Megaphone,
    subItems: [
      { id: 'marketing-discounts', label: 'İndirimler' },
      { id: 'marketing-campaigns', label: 'Kampanyalar' },
      { id: 'marketing-coupons', label: 'Kupon Yönetimi' },
      { id: 'marketing-draws', label: 'Çekilişler' },
      { id: 'marketing-contests', label: 'Yarışmalar' },
      { id: 'marketing-giftcard', label: 'Hediye Kartları' },
      { id: 'marketing-sms', label: 'Toplu SMS Gönderimi' },
      { id: 'marketing-acquisition', label: 'Müşteri Kazanımı ve Arama Süreçleri' },
    ],
  },
  {
    id: 'advertising',
    label: 'Reklam',
    icon: TrendingUp,
    subItems: [
      { id: 'advertising-seo', label: 'SEO Genel Ayarlar' },
      { id: 'advertising-keywords', label: 'Anahtar Kelime ve Performans' },
      { id: 'advertising-target', label: 'Hedef Kitle' },
      { id: 'advertising-competitors', label: 'Rakip Analizi' },
    ],
  },
  {
    id: 'sales-channels',
    label: 'Satış Kanalları',
    icon: Store,
    subItems: [
      { id: 'sales-all', label: 'Tüm Satış Kanalları Tek Panelde' },
      { id: 'sales-website', label: 'Web Sitesi' },
      { id: 'sales-trendyol', label: 'Trendyol' },
      { id: 'sales-amazon', label: 'Amazon' },
      { id: 'sales-etsy', label: 'Etsy' },
      { id: 'sales-ozon', label: 'Ozon' },
    ],
  },
  {
    id: 'social-media',
    label: 'Sosyal Medya Yönetimi',
    icon: Share2,
    subItems: [
      { id: 'social-posts', label: 'Paylaşımlar' },
      { id: 'social-engagement', label: 'Etkileşimler' },
      { id: 'social-messages', label: 'Mesajlar' },
    ],
  },
  {
    id: 'finance',
    label: 'Finans',
    icon: CreditCard,
    subItems: [
      { id: 'finance-cashflow', label: 'Nakit Akışı' },
      { id: 'finance-tracking', label: 'Gelir Gider Takibi' },
    ],
  },
  {
    id: 'accounting',
    label: 'Muhasebe',
    icon: Calculator,
    subItems: [
      { id: 'accounting-invoices', label: 'Kesilen Faturalar' },
      { id: 'accounting-taxes', label: 'Vergiler (3 Aylık / 6 Aylık / 1 Yıllık)' },
      { id: 'accounting-income-tax', label: 'Gelir Vergisi' },
      { id: 'accounting-budget', label: 'Şirket Bütçe Değeri' },
      { id: 'accounting-vat', label: 'KDV ve Vergi Ödeme Bilgileri' },
      { id: 'accounting-savings', label: 'Vergiden Kaçınma ve Tasarruf Önerileri' },
    ],
  },
  {
    id: 'purchasing',
    label: 'Satın Alma',
    icon: ShoppingBag,
    subItems: [
      { id: 'purchasing-process', label: 'Satın Alma Süreçleri' },
      { id: 'purchasing-suppliers', label: 'Tedarikçi Takibi' },
    ],
  },
  { id: 'reports', label: 'Raporlar', icon: FileText },
  { id: 'news', label: 'Haberler', icon: Newspaper },
  {
    id: 'settings',
    label: 'Ayarlar',
    icon: Settings,
    subItems: [
      { id: 'settings-general', label: 'Genel Sistem Ayarları' },
      { id: 'settings-api', label: 'API ve WebHook Bağlantıları' },
      { id: 'settings-connections', label: 'Bağlantılar' },
      { id: 'settings-converter', label: 'WebP ve WebM Format Dönüşümü' },
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
    if (shouldBeCollapsed) {
      setExpandedItems([]);
    }
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
      className={`bg-white h-screen overflow-y-auto overflow-x-hidden scrollbar-hide border-r border-gray-200 fixed left-[5px] top-[5px] transition-all duration-300 z-50 shadow-lg rounded-xl ${
        isCollapsed ? 'w-20' : 'w-[250px]'
      }`}
      style={{ height: 'calc(100vh - 10px)' }}
      onMouseEnter={() => shouldBeCollapsed && setIsCollapsed(false)}
      onMouseLeave={() => shouldBeCollapsed && setIsCollapsed(true)}
    >
      <div className={`transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-3'}`}>
        <button
          onClick={() => onPageChange('dashboard')}
          className={`flex items-center gap-2 w-full hover:opacity-80 transition-all duration-300 h-[50px] ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isCollapsed ? 'w-10 h-10' : 'w-9 h-9'
          }`}>
            <Package className={`text-white transition-all duration-300 ${
              isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
            }`} />
          </div>
          <div className={`text-left transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}>
            <h1 className="font-bold text-gray-900 whitespace-nowrap text-sm">E-Ticaret</h1>
            <p className="text-[10px] text-gray-500 whitespace-nowrap">Yönetim Paneli</p>
          </div>
        </button>

        <nav className="space-y-1 mt-3">
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
                className={`w-full flex items-center justify-between rounded-lg transition-all ${
                  isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
                } ${
                  activePage === item.id
                    ? 'bg-blue-500 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : ''}`}>
                  <item.icon className={`flex-shrink-0 transition-all duration-300 ${
                    isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                  }`} />
                  <span className={`text-[13px] transition-opacity duration-300 whitespace-nowrap ${
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
                <div className="ml-4 mt-1 space-y-0.5">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onPageChange(subItem.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all ${
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

        <div className={`mt-4 pt-3 border-t border-gray-200 transition-all duration-300 ${isCollapsed ? 'px-1' : 'px-0'}`}>
          <button
            onClick={async () => {
              try {
                await signOut();
              } catch (error) {
                console.error('Logout error:', error);
              }
            }}
            className={`w-full flex items-center gap-2.5 rounded-lg transition-all text-red-600 hover:bg-red-50 ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
            }`}
          >
            <LogOut className={`flex-shrink-0 transition-all duration-300 ${
              isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
            }`} />
            <span className={`text-[13px] font-medium transition-opacity duration-300 whitespace-nowrap ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>Cikis Yap</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
