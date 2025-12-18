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
      return <DashboardHome onNewProduct={() => setActivePage('product-upload')} />;
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
      'products-stock': { title: 'Stok Sayısı', description: 'Ürün stok durumlarını görüntüleyin' },
      'products-barcode': { title: 'Ürün Barkot', description: 'Barkod yönetimi' },
      'products-feedback': { title: 'Şikayet ve Öneri Kutusu' },
      'products-target': { title: 'Ürün Hedef Kitle ve Anahtar Kelime' },
      'products-profit': { title: 'Ürün Karlılık Hesabı' },
      'orders-returns': { title: 'İadeler' },
      'orders-favorites': { title: 'Favorilenenler' },
      'orders-abandoned': { title: 'Terk Edilmiş Sepetler' },
      'orders-followup': { title: 'Sipariş Sonrası Arama Dönüşüm' },
      'customers-chat': { title: 'Sohbet Geçmişi' },
      'customers-activity': { title: 'Satın Alma ve Etkileşimleri' },
      'social': { title: 'Sosyal Medya Yönetimi' },
      'social-posts': { title: 'Paylaşımlar' },
      'social-engagement': { title: 'Etkileşimler' },
      'social-messages': { title: 'Mesajlar' },
      'seo': { title: 'SEO', description: 'Arama motoru optimizasyonu görevleri' },
      'advertising': { title: 'Reklam', description: 'Reklam performansları ve yönetimi' },
      'sales': { title: 'Satış' },
      'marketing-contests': { title: 'Yarışmalar' },
      'marketing-giftcard': { title: 'Hediye Kartı' },
      'marketing-sms': { title: 'Toplu SMS Atma' },
      'marketing-call': { title: 'Arama' },
      'discount': { title: 'İndirim', description: 'İndirimden gelen dönüşümler ve fiyat-satış dengesi' },
      'campaigns': { title: 'Kampanyalar' },
      'campaigns-coupons': { title: 'Kuponlar' },
      'campaigns-draws': { title: 'Çekilişler' },
      'campaigns-methods': { title: 'Kampanya Yöntemleri' },
      'brand': { title: 'Marka Yönetimi' },
      'brand-positioning': { title: 'Konumlandırma' },
      'brand-identity': { title: 'Marka Kimliği' },
      'brand-awareness': { title: 'Marka Bilinirliği' },
      'brand-image': { title: 'Marka İmajı' },
      'brand-feedback': { title: 'Öneri ve Şikayetler' },
      'brand-packaging': { title: 'Paketlemeler' },
      'brand-influencer': { title: 'Influencer Yaratma' },
      'marketplaces': { title: 'Pazar Yerleri' },
      'marketplace-trendyol': { title: 'Trendyol' },
      'marketplace-n11': { title: 'N11' },
      'marketplace-hepsiburada': { title: 'Hepsiburada' },
      'marketplace-amazon': { title: 'Amazon' },
      'marketplace-etsy': { title: 'Etsy' },
      'marketplace-ozon': { title: 'Ozon' },
      'sales-channels': { title: 'Satış Kanalları' },
      'website': { title: 'Web Site', description: 'Site yönetimi ve düzenleme' },
      'finance': { title: 'Finans', description: 'Yatırım araçları ve finansal yönetim' },
      'accounting': { title: 'Muhasebe', description: 'Faturalar, vergiler ve bütçe yönetimi' },
      'accounting-invoices': { title: 'Kesilen Faturalar' },
      'accounting-taxes': { title: 'Vergiler' },
      'accounting-income-tax': { title: 'Gelir Vergisi' },
      'accounting-budget': { title: 'Şirket Bütçe Değeri' },
      'accounting-vat': { title: 'KDV ve Vergi Ödeme Bilgileri' },
      'accounting-suggestions': { title: 'Vergiden Kaçınma Önerileri' },
      'purchasing': { title: 'Satın Alma', description: 'Alım kayıtları ve detayları' },
      'cargo': { title: 'Kargo', description: 'Kargo maliyetleri ve kalite değerlendirmesi' },
      'payment-systems': { title: 'Ödeme Sistemleri', description: 'Komisyon oranları ve vade tarihleri' },
      'export': { title: 'İhracat', description: 'İhracat destekleri ve fırsatlar' },
      'news': { title: 'Haberler', description: 'Tekstil sektörü haberleri' },
      'apps': { title: 'Uygulamalar' },
      'rnd': { title: 'AR-GE', description: 'Şirket gelişimi için öneriler' },
      'converter': { title: 'WebP ve WebM Dönüştürücü', description: 'Görsel format dönüştürme' },
      'settings': { title: 'Ayarlar', description: 'Genel ayarlar ve tercihler' },
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
      <div className={`transition-all duration-300 ${activePage === 'dashboard' ? 'ml-64' : 'ml-20'}`}>
        <main className="p-4">{renderPage()}</main>
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
