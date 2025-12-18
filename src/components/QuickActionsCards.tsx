import { Plus, Image, Users, Megaphone, Share2, MessageCircle, FileText, Mail, Bell } from 'lucide-react';

interface QuickActionsCardsProps {
  onNewProduct: () => void;
  onPageChange?: (page: string) => void;
}

export default function QuickActionsCards({ onNewProduct, onPageChange }: QuickActionsCardsProps) {
  const actions = [
    {
      id: 'new-product',
      label: 'Yeni Ürün Ekle',
      icon: Plus,
      onClick: onNewProduct,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      borderColor: 'hover:border-blue-200',
    },
    {
      id: 'create-visual',
      label: 'Görsel Oluştur',
      icon: Image,
      onClick: () => onPageChange?.('create-visual'),
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-50',
      borderColor: 'hover:border-slate-200',
    },
    {
      id: 'create-influencer',
      label: 'Influencer Yarat',
      icon: Users,
      onClick: () => onPageChange?.('brand-influencer'),
      iconColor: 'text-gray-600',
      iconBg: 'bg-gray-50',
      borderColor: 'hover:border-gray-300',
    },
    {
      id: 'advertise',
      label: 'Reklam Ver',
      icon: Megaphone,
      onClick: () => onPageChange?.('advertising'),
      iconColor: 'text-slate-700',
      iconBg: 'bg-slate-50',
      borderColor: 'hover:border-slate-200',
    },
    {
      id: 'social-post',
      label: 'Paylaşım Yap',
      icon: Share2,
      onClick: () => onPageChange?.('social-posts'),
      iconColor: 'text-gray-700',
      iconBg: 'bg-gray-50',
      borderColor: 'hover:border-gray-300',
    },
    {
      id: 'chatbot',
      label: 'Chat Bot',
      icon: MessageCircle,
      onClick: () => onPageChange?.('chatbot'),
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-50',
      borderColor: 'hover:border-slate-200',
    },
    {
      id: 'reports',
      label: 'Raporlar',
      icon: FileText,
      onClick: () => onPageChange?.('reports'),
      iconColor: 'text-gray-600',
      iconBg: 'bg-gray-50',
      borderColor: 'hover:border-gray-300',
    },
    {
      id: 'messages',
      label: 'Mesajlar',
      icon: Mail,
      onClick: () => onPageChange?.('messages'),
      iconColor: 'text-slate-700',
      iconBg: 'bg-slate-50',
      borderColor: 'hover:border-slate-200',
    },
  ];

  return (
    <div className="mb-3">
      <h3 className="text-sm font-bold text-gray-700 mb-3 px-1">Sık Kullanılanlar</h3>
      <div className="flex gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`flex-1 bg-white border border-gray-200 ${action.borderColor} rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group`}
          >
            <div className="flex flex-col items-center gap-3 h-full">
              <div className={`${action.iconBg} rounded-xl p-3 transition-transform duration-300 group-hover:scale-110`}>
                <action.icon className={`w-6 h-6 ${action.iconColor}`} />
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
                {action.label}
              </span>
            </div>
          </button>
        ))}

        <button
          onClick={() => onPageChange?.('notifications')}
          className="w-24 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
        >
          <div className="flex flex-col items-center gap-3 h-full justify-center">
            <div className="bg-gray-50 rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
              <Bell className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
              Bildirimler
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
