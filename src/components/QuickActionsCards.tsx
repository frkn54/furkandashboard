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
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      id: 'create-visual',
      label: 'Görsel Oluştur',
      icon: Image,
      onClick: () => onPageChange?.('create-visual'),
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-emerald-700',
    },
    {
      id: 'create-influencer',
      label: 'Influencer Yarat',
      icon: Users,
      onClick: () => onPageChange?.('brand-influencer'),
      gradient: 'from-rose-500 to-rose-600',
      hoverGradient: 'hover:from-rose-600 hover:to-rose-700',
    },
    {
      id: 'advertise',
      label: 'Reklam Ver',
      icon: Megaphone,
      onClick: () => onPageChange?.('advertising'),
      gradient: 'from-amber-500 to-amber-600',
      hoverGradient: 'hover:from-amber-600 hover:to-amber-700',
    },
    {
      id: 'social-post',
      label: 'Paylaşım Yap',
      icon: Share2,
      onClick: () => onPageChange?.('social-posts'),
      gradient: 'from-cyan-500 to-cyan-600',
      hoverGradient: 'hover:from-cyan-600 hover:to-cyan-700',
    },
    {
      id: 'chatbot',
      label: 'Chat Bot',
      icon: MessageCircle,
      onClick: () => onPageChange?.('chatbot'),
      gradient: 'from-violet-500 to-violet-600',
      hoverGradient: 'hover:from-violet-600 hover:to-violet-700',
    },
    {
      id: 'reports',
      label: 'Raporlar',
      icon: FileText,
      onClick: () => onPageChange?.('reports'),
      gradient: 'from-slate-500 to-slate-600',
      hoverGradient: 'hover:from-slate-600 hover:to-slate-700',
    },
    {
      id: 'messages',
      label: 'Mesajlar',
      icon: Mail,
      onClick: () => onPageChange?.('messages'),
      gradient: 'from-teal-500 to-teal-600',
      hoverGradient: 'hover:from-teal-600 hover:to-teal-700',
    },
  ];

  return (
    <div className="mb-3">
      <div className="flex gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`flex-1 bg-gradient-to-br ${action.gradient} ${action.hoverGradient} text-white rounded-xl p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md`}
          >
            <div className="flex flex-col items-center gap-2 h-full">
              <div className="bg-white bg-opacity-20 rounded-lg p-2.5">
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-center leading-tight">
                {action.label}
              </span>
            </div>
          </button>
        ))}

        <button
          onClick={() => onPageChange?.('notifications')}
          className="w-20 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          <div className="flex flex-col items-center gap-2 h-full justify-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-center leading-tight">
              Bildirimler
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
