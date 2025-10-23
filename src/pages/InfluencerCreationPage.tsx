import { useState, useEffect } from 'react';
import { User, Upload, Save, Trash2, Edit2, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Influencer } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function InfluencerCreationPage() {
  const { user } = useAuth();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    avatar_url: '',
    age_range: '',
    gender: '',
    ethnicity: '',
    body_type: '',
    hair_style: '',
    distinctive_features: '',
    language: 'Turkish',
    dialect: '',
    tone: 'friendly',
    speaking_style: 'conversational',
    energy_level: 5,
    brand_alignment: '',
  });

  useEffect(() => {
    loadInfluencers();
  }, [user]);

  const loadInfluencers = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading influencers:', error);
    } else {
      setInfluencers(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      avatar_url: '',
      age_range: '',
      gender: '',
      ethnicity: '',
      body_type: '',
      hair_style: '',
      distinctive_features: '',
      language: 'Turkish',
      dialect: '',
      tone: 'friendly',
      speaking_style: 'conversational',
      energy_level: 5,
      brand_alignment: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!user || !formData.name) {
      alert('Lütfen influencer adını girin');
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('influencers')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingId)
          .eq('user_id', user.id);

        if (error) throw error;
        alert('Influencer güncellendi!');
      } else {
        const { error } = await supabase
          .from('influencers')
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
        alert('Influencer oluşturuldu!');
      }

      resetForm();
      loadInfluencers();
    } catch (error) {
      console.error('Error saving influencer:', error);
      alert('Kaydetme sırasında hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (influencer: Influencer) => {
    setFormData({
      name: influencer.name,
      avatar_url: influencer.avatar_url || '',
      age_range: influencer.age_range,
      gender: influencer.gender,
      ethnicity: influencer.ethnicity,
      body_type: influencer.body_type,
      hair_style: influencer.hair_style,
      distinctive_features: influencer.distinctive_features,
      language: influencer.language,
      dialect: influencer.dialect,
      tone: influencer.tone,
      speaking_style: influencer.speaking_style,
      energy_level: influencer.energy_level,
      brand_alignment: influencer.brand_alignment,
    });
    setEditingId(influencer.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu influencer\'ı silmek istediğinize emin misiniz?')) return;

    const { error } = await supabase
      .from('influencers')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error deleting influencer:', error);
      alert('Silme sırasında hata oluştu');
    } else {
      loadInfluencers();
      if (editingId === id) resetForm();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Temel Bilgiler
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Influencer Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Örn: Ayşe Yılmaz"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profil Görseli URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.avatar_url}
                    onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Yükle
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Fiziksel Özellikler</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yaş Aralığı</label>
                <select
                  value={formData.age_range}
                  onChange={(e) => handleInputChange('age_range', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46-55">46-55</option>
                  <option value="56+">56+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="female">Kadın</option>
                  <option value="male">Erkek</option>
                  <option value="non-binary">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Etnik Köken</label>
                <select
                  value={formData.ethnicity}
                  onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="caucasian">Kafkas</option>
                  <option value="asian">Asyalı</option>
                  <option value="african">Afrikalı</option>
                  <option value="middle-eastern">Orta Doğu</option>
                  <option value="mixed">Karma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vücut Tipi</label>
                <select
                  value={formData.body_type}
                  onChange={(e) => handleInputChange('body_type', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="slim">İnce</option>
                  <option value="athletic">Atletik</option>
                  <option value="average">Ortalama</option>
                  <option value="curvy">Dolgun</option>
                  <option value="plus-size">Büyük Beden</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saç Stili</label>
                <input
                  type="text"
                  value={formData.hair_style}
                  onChange={(e) => handleInputChange('hair_style', e.target.value)}
                  placeholder="Örn: Uzun, dalgalı, siyah"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ayırt Edici Özellikler</label>
                <input
                  type="text"
                  value={formData.distinctive_features}
                  onChange={(e) => handleInputChange('distinctive_features', e.target.value)}
                  placeholder="Örn: Gözlük, küpe"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Dil ve İletişim</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Turkish">Türkçe</option>
                  <option value="English">İngilizce</option>
                  <option value="German">Almanca</option>
                  <option value="French">Fransızca</option>
                  <option value="Spanish">İspanyolca</option>
                  <option value="Arabic">Arapça</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lehçe/Ağız</label>
                <input
                  type="text"
                  value={formData.dialect}
                  onChange={(e) => handleInputChange('dialect', e.target.value)}
                  placeholder="Örn: İstanbul Türkçesi"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">AI Kişilik Ayarları</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ton</label>
                  <select
                    value={formData.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="friendly">Arkadaş Canlısı</option>
                    <option value="professional">Profesyonel</option>
                    <option value="casual">Rahat</option>
                    <option value="enthusiastic">Coşkulu</option>
                    <option value="calm">Sakin</option>
                    <option value="authoritative">Otoriter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konuşma Stili</label>
                  <select
                    value={formData.speaking_style}
                    onChange={(e) => handleInputChange('speaking_style', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="conversational">Konuşma Tarzı</option>
                    <option value="formal">Resmi</option>
                    <option value="storytelling">Hikaye Anlatımı</option>
                    <option value="educational">Eğitici</option>
                    <option value="humorous">Mizahi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enerji Seviyesi: {formData.energy_level}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.energy_level}
                  onChange={(e) => handleInputChange('energy_level', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Düşük (1)</span>
                  <span>Orta (5)</span>
                  <span>Yüksek (10)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marka Uyumu</label>
                <textarea
                  value={formData.brand_alignment}
                  onChange={(e) => handleInputChange('brand_alignment', e.target.value)}
                  placeholder="Bu influencer'ın markanızı nasıl temsil etmesini istiyorsunuz? Değerleriniz ve marka kişiliğiniz hakkında bilgi verin..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !formData.name}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Kaydet')}
            </button>
            {isEditing && (
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                İptal
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {influencers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Oluşturulmuş Influencer'lar</h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {influencers.map((influencer) => (
                    <div key={influencer.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer relative">
                      <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                        {influencer.avatar_url ? (
                          <img src={influencer.avatar_url} alt={influencer.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-blue-400" />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => handleEdit(influencer)}
                            className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(influencer.id)}
                            className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-sm text-gray-900 truncate">{influencer.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {influencer.age_range && `${influencer.age_range} yaş`}
                          {influencer.age_range && influencer.gender && ' • '}
                          {influencer.gender === 'female' && 'Kadın'}
                          {influencer.gender === 'male' && 'Erkek'}
                          {influencer.gender === 'non-binary' && 'Diğer'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{influencer.language} • Enerji: {influencer.energy_level}/10</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Önizleme</h3>

            {formData.name ? (
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-24 h-24 text-blue-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900">{formData.name}</h4>
                  <div className="mt-3 space-y-2 text-sm">
                    {formData.age_range && (
                      <p className="text-gray-600">
                        <span className="font-medium">Yaş:</span> {formData.age_range}
                      </p>
                    )}
                    {formData.language && (
                      <p className="text-gray-600">
                        <span className="font-medium">Dil:</span> {formData.language}
                      </p>
                    )}
                    {formData.tone && (
                      <p className="text-gray-600">
                        <span className="font-medium">Ton:</span> {formData.tone}
                      </p>
                    )}
                    <p className="text-gray-600">
                      <span className="font-medium">Enerji:</span> {formData.energy_level}/10
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Bilgileri doldurun</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
