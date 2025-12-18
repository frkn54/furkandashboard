import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import ProductsPage from './pages/ProductsPage';
import ProductUploadPage from './pages/ProductUploadPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import MarketingPage from './pages/MarketingPage';
import InfluencerCreationPage from './pages/InfluencerCreationPage';
import SettingsPage from './pages/SettingsPage';
import PlaceholderPage from './pages/PlaceholderPage';

function DashboardContent() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    if (activePage === 'dashboard') {
      return (
        <DashboardHome
          onNewProduct={() => setActivePage('product-upload')}
          onPageChange={setActivePage}
        />
      );
    }

    if (activePage === 'products' || activePage === 'products-list') {
      return <ProductsPage />;
    }

    if (activePage === 'product-upload') {
      return <ProductUploadPage />;
    }

    if (activePage === 'orders' || activePage === 'orders-list') {
      return <OrdersPage />;
    }

    if (activePage === 'customers' || activePage === 'customers-info') {
      return <CustomersPage />;
    }

    if (activePage === 'reports') {
      return <ReportsPage />;
    }

    if (activePage === 'marketing') {
      return <MarketingPage />;
    }

    if (activePage === 'brand-influencer') {
      return <InfluencerCreationPage />;
    }

    if (activePage === 'settings' || activePage === 'settings-profile') {
      return <SettingsPage />;
    }

    const pageMap: Record<string, { title: string; description?: string }> = {
      'create-visual': { title: 'Görsel Oluştur', description: 'AI destekli görsel oluşturma' },
      'chatbot': { title: 'Chat Bot', description: 'Müşteri destek bot yönetimi' },
      'messages': { title: 'Mesajlar', description: 'Tüm mesajlarınızı görüntüleyin' },
      'notifications': { title: 'Bildirimler', description: 'Sistem bildirimleri' },
      'finance-cashflow': { title: 'Nakit Akışı', description: 'Detaylı nakit akışı analizi' },
      'products-stock': { title: 'Stok Takibi', description: 'Ürün stok durumlarını görüntüleyin' },
      'products-barcode': { title: 'Ürün Barkot', description: 'Barkod yönetimi' },
      'products-feedback': { title: 'Şikayet ve Öneri Kutusu' },
      'products-target': { title: 'Ürün Hedef Kitle ve Anahtar Kelime' },
      'products-profit': { title: 'Ürün Karlılık Analizi' },
      'orders-returns': { title: 'İadeler' },
      'orders-favorites': { title: 'Favorilenen Ürünler' },
      'orders-abandoned': { title: 'Terk Edilmiş Sepetler' },
      'orders-followup': { title: 'Sipariş Sonrası Arama Dönüşümü' },
      'customers-history': { title: 'Satın Alma Geçmişi' },
      'customers-analysis': { title: 'Etkileşim ve Davranış Analizi' },
      'customers-chat': { title: 'Sohbet Geçmişi' },
      'social': { title: 'Sosyal Medya Yönetimi' },
      'social-posts': { title: 'Paylaşımlar' },
      'social-engagement': { title: 'Etkileşimler' },
      'social-messages': { title: 'Mesajlar' },
      'advertising': { title: 'Reklam', description: 'Reklam performansları ve yönetimi' },
      'advertising-seo': { title: 'SEO Genel Ayarlar' },
      'advertising-keywords': { title: 'Anahtar Kelime ve Performans' },
      'advertising-target': { title: 'Hedef Kitle' },
      'advertising-competitors': { title: 'Rakip Analizi' },
      'marketing-discounts': { title: 'İndirimler' },
      'marketing-campaigns': { title: 'Kampanyalar' },
      'marketing-coupons': { title: 'Kupon Yönetimi' },
      'marketing-draws': { title: 'Çekilişler' },
      'marketing-contests': { title: 'Yarışmalar' },
      'marketing-giftcard': { title: 'Hediye Kartları' },
      'marketing-sms': { title: 'Toplu SMS Gönderimi' },
      'marketing-acquisition': { title: 'Müşteri Kazanımı ve Arama Süreçleri' },
      'brand': { title: 'Marka Yönetimi' },
      'brand-positioning': { title: 'Marka Konumlandırma' },
      'brand-identity': { title: 'Marka Kimliği' },
      'brand-awareness': { title: 'Marka Bilinirliği' },
      'brand-image': { title: 'Marka İmajı' },
      'brand-feedback': { title: 'Öneri ve Şikayet Yönetimi' },
      'brand-influencer': { title: 'Influencer Oluşturma ve Yönetme' },
      'sales-channels': { title: 'Satış Kanalları' },
      'sales-all': { title: 'Tüm Satış Kanalları Tek Panelde' },
      'sales-website': { title: 'Web Sitesi' },
      'sales-trendyol': { title: 'Trendyol' },
      'sales-amazon': { title: 'Amazon' },
      'sales-etsy': { title: 'Etsy' },
      'sales-ozon': { title: 'Ozon' },
      'finance': { title: 'Finans', description: 'Yatırım araçları ve finansal yönetim' },
      'finance-tracking': { title: 'Gelir Gider Takibi' },
      'accounting': { title: 'Muhasebe', description: 'Faturalar, vergiler ve bütçe yönetimi' },
      'accounting-invoices': { title: 'Kesilen Faturalar' },
      'accounting-taxes': { title: 'Vergiler (3 Aylık / 6 Aylık / 1 Yıllık)' },
      'accounting-income-tax': { title: 'Gelir Vergisi' },
      'accounting-budget': { title: 'Şirket Bütçe Değeri' },
      'accounting-vat': { title: 'KDV ve Vergi Ödeme Bilgileri' },
      'accounting-savings': { title: 'Vergiden Kaçınma ve Tasarruf Önerileri' },
      'purchasing': { title: 'Satın Alma', description: 'Alım kayıtları ve detayları' },
      'purchasing-process': { title: 'Satın Alma Süreçleri' },
      'purchasing-suppliers': { title: 'Tedarikçi Takibi' },
      'news': { title: 'Haberler', description: 'Tekstil sektörü haberleri' },
      'settings': { title: 'Ayarlar', description: 'Genel ayarlar ve tercihler' },
      'settings-general': { title: 'Genel Sistem Ayarları' },
      'settings-api': { title: 'API ve WebHook Bağlantıları' },
      'settings-connections': { title: 'Bağlantılar' },
      'settings-converter': { title: 'WebP ve WebM Format Dönüşümü' },
    };

    const pageInfo = pageMap[activePage];
    if (pageInfo) {
      return <PlaceholderPage title={pageInfo.title} description={pageInfo.description} />;
    }

    return <DashboardHome />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <div className={`transition-all duration-300 ${activePage === 'dashboard' ? 'ml-[255px]' : 'ml-20'}`}>
        <main className="p-[5px]">{renderPage()}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}

export default App;
