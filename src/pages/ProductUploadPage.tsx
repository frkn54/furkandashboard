import { useState, useEffect, useRef } from 'react';
import { Upload, Sparkles, Video, Image as ImageIcon, Check, X, Loader, Instagram, Facebook, Twitter, Zap, Globe, Camera, Play, Film, Mic, MicOff, Volume2, RefreshCw, FileText, Tag, Users, DollarSign, Package, Link as LinkIcon, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Influencer } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface ReferenceImage {
  id: string;
  file: File | null;
  url: string;
  isPrimary: boolean;
}

interface VisualCreationPanel {
  type: 'studio' | 'story' | 'reference';
  count: number;
  style: string;
  description: string;
  descriptionAudioBlob: Blob | null;
  descriptionAudioUrl: string | null;
  influencer: string;
  platforms: string[];
  size: string;
  referenceMode: 'exact' | 'similar' | null;
  backgroundImage: File | null;
  backgroundImageUrl: string | null;
  backgroundDescription: string;
  completed: boolean;
}

interface VideoCreationPanel {
  type: 'promo' | 'story' | 'reference';
  count: number;
  platforms: string[];
  description: string;
  descriptionAudioBlob: Blob | null;
  descriptionAudioUrl: string | null;
  duration: number;
  style: string;
  ctaText: string;
  influencer: string;
  size: string;
  referenceMode: 'exact' | 'similar' | null;
  referenceVideo: File | null;
  referenceVideoUrl: string | null;
  referenceAudio: Blob | null;
  referenceAudioUrl: string | null;
  useOriginalAudio: boolean;
  backgroundImage: File | null;
  backgroundImageUrl: string | null;
  backgroundDescription: string;
  completed: boolean;
}

const PLATFORMS: Platform[] = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
  { id: 'tiktok', name: 'TikTok', icon: <Zap className="w-4 h-4" /> },
  { id: 'pinterest', name: 'Pinterest', icon: <ImageIcon className="w-4 h-4" /> },
];

const IMAGE_SIZES = [
  { value: 'square', label: 'Kare (1:1)' },
  { value: '4:5', label: 'Dikey (4:5)' },
  { value: '9:16', label: 'Story (9:16)' },
  { value: '16:9', label: 'Yatay (16:9)' },
  { value: 'web-banner', label: 'Web Banner' },
];

const VIDEO_SIZES = [
  { value: '9:16', label: 'Dikey (9:16)' },
  { value: '1:1', label: 'Kare (1:1)' },
  { value: '16:9', label: 'Yatay (16:9)' },
];

export default function ProductUploadPage() {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  // Product Information
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [referenceProductUrl, setReferenceProductUrl] = useState('');

  // Reference Images
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Visual Creation
  const [selectedVisualTypes, setSelectedVisualTypes] = useState<('studio' | 'story' | 'reference')[]>([]);
  const [visualPanels, setVisualPanels] = useState<Record<string, VisualCreationPanel>>({
    studio: {
      type: 'studio',
      count: 4,
      style: 'Modern',
      description: '',
      descriptionAudioBlob: null,
      descriptionAudioUrl: null,
      influencer: '',
      platforms: [],
      size: 'square',
      referenceMode: null,
      backgroundImage: null,
      backgroundImageUrl: null,
      backgroundDescription: '',
      completed: false,
    },
    story: {
      type: 'story',
      count: 4,
      style: 'Modern',
      description: '',
      descriptionAudioBlob: null,
      descriptionAudioUrl: null,
      influencer: '',
      platforms: [],
      size: '9:16',
      referenceMode: null,
      backgroundImage: null,
      backgroundImageUrl: null,
      backgroundDescription: '',
      completed: false,
    },
    reference: {
      type: 'reference',
      count: 4,
      style: 'Modern',
      description: '',
      descriptionAudioBlob: null,
      descriptionAudioUrl: null,
      influencer: '',
      platforms: [],
      size: 'square',
      referenceMode: null,
      backgroundImage: null,
      backgroundImageUrl: null,
      backgroundDescription: '',
      completed: false,
    },
  });
  const [isRecordingVisual, setIsRecordingVisual] = useState<string | null>(null);
  const [visualBackgroundImage, setVisualBackgroundImage] = useState<File | null>(null);
  const [visualBackgroundImageUrl, setVisualBackgroundImageUrl] = useState<string | null>(null);
  const [visualBackgroundDescription, setVisualBackgroundDescription] = useState('');

  // Video Creation
  const [selectedVideoTypes, setSelectedVideoTypes] = useState<('promo' | 'story' | 'reference')[]>([]);
  const [videoPanels, setVideoPanels] = useState<Record<string, VideoCreationPanel>>({
    promo: {
      type: 'promo',
      count: 1,
      platforms: [],
      description: '',
      descriptionAudioBlob: null,
      descriptionAudioUrl: null,
      duration: 30,
      style: 'Ürün Vitrin',
      ctaText: '',
      influencer: '',
      size: '9:16',
      referenceMode: null,
      referenceVideo: null,
      referenceVideoUrl: null,
      referenceAudio: null,
      referenceAudioUrl: null,
      useOriginalAudio: false,
      backgroundImage: null,
      backgroundImageUrl: null,
      backgroundDescription: '',
      completed: false,
    },
    story: {
      type: 'story',
      count: 1,
      platforms: [],
      description: '',
      descriptionAudioBlob: null,
      descriptionAudioUrl: null,
      duration: 30,
      style: 'Müşteri Yolculuğu',
      ctaText: '',
      influencer: '',
      size: '9:16',
      referenceMode: null,
      referenceVideo: null,
      referenceVideoUrl: null,
      referenceAudio: null,
      referenceAudioUrl: null,
      useOriginalAudio: false,
      backgroundImage: null,
      backgroundImageUrl: null,
      backgroundDescription: '',
      completed: false,
    },
    reference: {
      type: 'reference',
      count: 1,
      platforms: [],
      description: '',
      descriptionAudioBlob: null,
      descriptionAudioUrl: null,
      duration: 30,
      style: 'Trend',
      ctaText: '',
      influencer: '',
      size: '9:16',
      referenceMode: null,
      referenceVideo: null,
      referenceVideoUrl: null,
      referenceAudio: null,
      referenceAudioUrl: null,
      useOriginalAudio: false,
      backgroundImage: null,
      backgroundImageUrl: null,
      backgroundDescription: '',
      completed: false,
    },
  });
  const [isRecordingVideo, setIsRecordingVideo] = useState<string | null>(null);
  const [videoBackgroundImage, setVideoBackgroundImage] = useState<File | null>(null);
  const [videoBackgroundImageUrl, setVideoBackgroundImageUrl] = useState<string | null>(null);
  const [videoBackgroundDescription, setVideoBackgroundDescription] = useState('');

  // Keywords and Target Audience
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  // Submission
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    loadInfluencers();

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'tr-TR';
    }
  }, [user]);

  const loadInfluencers = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setInfluencers(data);
  };

  // Camera Functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      setShowCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera error:', error);
      alert('Kamera açılamadı — tarayıcı izinlerini kontrol edin.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageUrl);
      }
    }
  };

  const confirmCapture = async () => {
    if (capturedImage) {
      const blob = await fetch(capturedImage).then(r => r.blob());
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });

      const newImage: ReferenceImage = {
        id: `img-${Date.now()}`,
        file,
        url: capturedImage,
        isPrimary: referenceImages.length === 0,
      };

      setReferenceImages(prev => [...prev, newImage]);
      stopCamera();
      setCapturedImage(null);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: ReferenceImage[] = Array.from(files).map((file, index) => ({
        id: `img-${Date.now()}-${index}`,
        file,
        url: URL.createObjectURL(file),
        isPrimary: referenceImages.length === 0 && index === 0,
      }));
      setReferenceImages(prev => [...prev, ...newImages]);
    }
  };

  const handleAdditionalImagesClick = () => {
    additionalImagesInputRef.current?.click();
  };

  const removeReferenceImage = (id: string) => {
    setReferenceImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const setPrimaryImage = (id: string) => {
    setReferenceImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === id,
    })));
  };

  // Visual Creation Functions
  const toggleVisualType = (type: 'studio' | 'story' | 'reference') => {
    setSelectedVisualTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const updateVisualPanel = (type: string, field: string, value: any) => {
    setVisualPanels(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const toggleVisualPlatform = (type: string, platformId: string) => {
    setVisualPanels(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        platforms: prev[type].platforms.includes(platformId)
          ? prev[type].platforms.filter(id => id !== platformId)
          : [...prev[type].platforms, platformId],
      },
    }));
  };

  const completeVisualPanel = (type: string) => {
    const panel = visualPanels[type];

    // Validate reference mode for reference type
    if (type === 'reference' && !panel.referenceMode) {
      alert('Lütfen referans görselin birebir mi yoksa benzer mi olacağını seçin.');
      return;
    }

    updateVisualPanel(type, 'completed', true);
  };

  // Video Creation Functions
  const toggleVideoType = (type: 'promo' | 'story' | 'reference') => {
    setSelectedVideoTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const updateVideoPanel = (type: string, field: string, value: any) => {
    setVideoPanels(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const toggleVideoPlatform = (type: string, platformId: string) => {
    setVideoPanels(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        platforms: prev[type].platforms.includes(platformId)
          ? prev[type].platforms.filter(id => id !== platformId)
          : [...prev[type].platforms, platformId],
      },
    }));
  };

  const handleReferenceVideoUpload = async (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateVideoPanel(type, 'referenceVideo', file);
      updateVideoPanel(type, 'referenceVideoUrl', url);

      // Extract audio from video (simplified - in production, use FFmpeg or similar)
      // For now, just create a placeholder
      const audioBlob = new Blob([], { type: 'audio/webm' });
      updateVideoPanel(type, 'referenceAudio', audioBlob);
      updateVideoPanel(type, 'referenceAudioUrl', URL.createObjectURL(audioBlob));
    }
  };

  const completeVideoPanel = (type: string) => {
    const panel = videoPanels[type];

    // Validate reference mode for reference type
    if (type === 'reference' && !panel.referenceMode) {
      alert('Lütfen referans videonun birebir mi yoksa benzer mi olacağını seçin.');
      return;
    }

    updateVideoPanel(type, 'completed', true);
  };

  // Audio Recording Functions
  const startVoiceRecording = async (context: 'visual' | 'video', type: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (context === 'visual') {
          updateVisualPanel(type, 'descriptionAudioBlob', audioBlob);
          updateVisualPanel(type, 'descriptionAudioUrl', audioUrl);
        } else {
          updateVideoPanel(type, 'descriptionAudioBlob', audioBlob);
          updateVideoPanel(type, 'descriptionAudioUrl', audioUrl);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();

      if (recognitionRef.current) {
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            }
          }

          if (finalTranscript) {
            if (context === 'visual') {
              const current = visualPanels[type].description;
              updateVisualPanel(type, 'description', current + finalTranscript);
            } else {
              const current = videoPanels[type].description;
              updateVideoPanel(type, 'description', current + finalTranscript);
            }
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };

        recognitionRef.current.start();
      }

      if (context === 'visual') {
        setIsRecordingVisual(type);
      } else {
        setIsRecordingVideo(type);
      }
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Mikrofon erişimi sağlanamadı. Lütfen izinleri kontrol edin.');
    }
  };

  const stopVoiceRecording = (context: 'visual' | 'video') => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (context === 'visual') {
      setIsRecordingVisual(null);
    } else {
      setIsRecordingVideo(null);
    }
  };

  const playAudio = (audioUrl: string | null) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const retryVoiceRecording = (context: 'visual' | 'video', type: string) => {
    if (context === 'visual') {
      updateVisualPanel(type, 'description', '');
      updateVisualPanel(type, 'descriptionAudioBlob', null);
      updateVisualPanel(type, 'descriptionAudioUrl', null);
    } else {
      updateVideoPanel(type, 'description', '');
      updateVideoPanel(type, 'descriptionAudioBlob', null);
      updateVideoPanel(type, 'descriptionAudioUrl', null);
    }
    startVoiceRecording(context, type);
  };

  // Validation and Submission
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!productCode.trim()) errors.push('Ürün Kodu zorunludur');
    if (!productName.trim()) errors.push('Ürün Adı zorunludur');
    if (!productStock.trim() || isNaN(Number(productStock))) errors.push('Stok Adedi geçerli bir sayı olmalıdır');
    if (!productPrice.trim() || isNaN(Number(productPrice))) errors.push('Ürün Fiyatı geçerli bir sayı olmalıdır');

    // Check reference modes
    if (selectedVisualTypes.includes('reference') && !visualPanels.reference.referenceMode) {
      errors.push('Referans Görsel için referans modunu seçmelisiniz (Birebir veya Benzer)');
    }

    if (selectedVideoTypes.includes('reference') && !videoPanels.reference.referenceMode) {
      errors.push('Referans Video için referans modunu seçmelisiniz (Birebir veya Benzer)');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) {
      alert('Lütfen tüm zorunlu alanları doldurun:\n' + validationErrors.join('\n'));
      return;
    }

    setIsCreatingProduct(true);

    try {
      const formData = new FormData();

      // Build JSON payload
      const payload = {
        product: {
          code: productCode,
          name: productName,
          description: productDescription || null,
          stock: Number(productStock),
          price: Number(productPrice),
          url: productUrl || null,
          reference_url: referenceProductUrl || null,
        },
        reference_images: referenceImages.map((img, index) => ({
          id: img.id,
          filename: img.file ? img.file.name : `reference-${index}.jpg`,
          is_primary: img.isPrimary,
        })),
        visual_creation: selectedVisualTypes.map(type => {
          const panel = visualPanels[type];
          return {
            type,
            count: panel.count,
            style: panel.style,
            description_text: panel.description || null,
            description_audio_filename: panel.descriptionAudioBlob ? `visual_${type}_desc.webm` : null,
            influencer: panel.influencer || null,
            platforms: panel.platforms,
            size: panel.size,
            background_image_filename: panel.backgroundImage ? panel.backgroundImage.name : (visualBackgroundImage ? visualBackgroundImage.name : null),
            background_description: panel.backgroundDescription || visualBackgroundDescription || null,
            referenceMode: panel.referenceMode,
          };
        }),
        video_creation: selectedVideoTypes.map(type => {
          const panel = videoPanels[type];
          return {
            type,
            count: panel.count,
            platforms: panel.platforms,
            description_text: panel.description || null,
            description_audio_filename: panel.descriptionAudioBlob ? `video_${type}_desc.webm` : null,
            duration_seconds: panel.duration,
            style: panel.style,
            cta_text: panel.ctaText || null,
            influencer: panel.influencer || null,
            size: panel.size,
            background_image_filename: panel.backgroundImage ? panel.backgroundImage.name : (videoBackgroundImage ? videoBackgroundImage.name : null),
            background_description: panel.backgroundDescription || videoBackgroundDescription || null,
            referenceMode: panel.referenceMode,
            reference_video: panel.referenceVideo ? {
              filename: panel.referenceVideo.name,
              audio_filename: panel.referenceAudio ? `ref_video_${type}_audio.webm` : null,
              use_original_audio: panel.useOriginalAudio,
            } : null,
          };
        }),
        keywords: keywords || null,
        target_audience: targetAudience || null,
        meta: {
          created_by_user: user?.id || 'unknown',
          created_at: new Date().toISOString(),
          source: 'bolt_ui_v2',
        },
      };

      formData.append('payload', JSON.stringify(payload));

      // Append reference images
      referenceImages.forEach((img, index) => {
        if (img.file) {
          formData.append('files', img.file, img.file.name);
        }
      });

      // Append visual creation files
      selectedVisualTypes.forEach(type => {
        const panel = visualPanels[type];
        if (panel.descriptionAudioBlob) {
          formData.append('files', panel.descriptionAudioBlob, `visual_${type}_desc.webm`);
        }
        if (panel.backgroundImage) {
          formData.append('files', panel.backgroundImage, panel.backgroundImage.name);
        }
      });

      // Append global visual background
      if (visualBackgroundImage) {
        formData.append('files', visualBackgroundImage, visualBackgroundImage.name);
      }

      // Append video creation files
      selectedVideoTypes.forEach(type => {
        const panel = videoPanels[type];
        if (panel.descriptionAudioBlob) {
          formData.append('files', panel.descriptionAudioBlob, `video_${type}_desc.webm`);
        }
        if (panel.backgroundImage) {
          formData.append('files', panel.backgroundImage, panel.backgroundImage.name);
        }
        if (panel.referenceVideo) {
          formData.append('files', panel.referenceVideo, panel.referenceVideo.name);
        }
        if (panel.referenceAudio) {
          formData.append('files', panel.referenceAudio, `ref_video_${type}_audio.webm`);
        }
      });

      // Append global video background
      if (videoBackgroundImage) {
        formData.append('files', videoBackgroundImage, videoBackgroundImage.name);
      }

      const response = await fetch('https://n8n.furkaneskicioglu.com/webhook-test/test', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Webhook failed: ' + response.status);
      }

      alert('Ürün başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Product creation error:', error);
      alert('Ürün oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <div className="max-w-full px-8 py-6">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Reference Image Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Ürün Referans Görseli
            </h3>

            <div className="space-y-3">
              {referenceImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {referenceImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.url}
                        alt="Reference"
                        className={`w-full h-32 object-cover rounded-lg border-2 ${img.isPrimary ? 'border-blue-500' : 'border-gray-200'}`}
                      />
                      <div className="absolute top-1 right-1 flex gap-1">
                        {!img.isPrimary && (
                          <button
                            onClick={() => setPrimaryImage(img.id)}
                            className="bg-white rounded p-1 shadow text-xs"
                            title="Ana görsel yap"
                          >
                            ⭐
                          </button>
                        )}
                        <button
                          onClick={() => removeReferenceImage(img.id)}
                          className="bg-red-500 text-white rounded p-1 shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {img.isPrimary && (
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                          Ana
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                  <div className="text-center p-4">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Ürün görseli</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={startCamera}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Kamera
                </button>
                <button
                  onClick={handleGalleryClick}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200"
                >
                  <ImageIcon className="w-4 h-4" />
                  Galeri
                </button>
              </div>

              <button
                onClick={handleAdditionalImagesClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200 text-sm"
              >
                <span>+ Görsel</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <input
                ref={additionalImagesInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>
          </div>

          {/* Visual Creation Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Görsel Oluşturma
              </h3>
              <div className="text-right text-xs">
                <label className="block text-gray-600 mb-1">Görsel Arka Planı</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVisualBackgroundImage(file);
                      setVisualBackgroundImageUrl(URL.createObjectURL(file));
                    }
                  }}
                  accept="image/*"
                  className="text-xs"
                />
                {visualBackgroundImageUrl && (
                  <img src={visualBackgroundImageUrl} className="w-16 h-16 object-cover rounded mt-1" alt="Background" />
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">Görsel Tipleri (Birden fazla seçebilirsiniz)</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => toggleVisualType('studio')}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 font-medium transition-all text-xs ${
                  selectedVisualTypes.includes('studio')
                    ? 'bg-pink-50 border-pink-500 text-pink-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span>Stüdyo Çekimi</span>
                <span className="text-[10px]">(web için)</span>
              </button>
              <button
                onClick={() => toggleVisualType('story')}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 font-medium transition-all text-xs ${
                  selectedVisualTypes.includes('story')
                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Film className="w-5 h-5" />
                <span>Hikaye Post</span>
                <span className="text-[10px]">Paylaşımı</span>
              </button>
              <button
                onClick={() => toggleVisualType('reference')}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 font-medium transition-all text-xs ${
                  selectedVisualTypes.includes('reference')
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Referans</span>
                <span className="text-[10px]">Görsel</span>
              </button>
            </div>

            {selectedVisualTypes.map((type) => {
              const panel = visualPanels[type];
              const isRecording = isRecordingVisual === type;

              return (
                <div key={type} className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3 space-y-3">
                  <h4 className="font-semibold text-sm text-gray-900 capitalize flex items-center justify-between">
                    <span>{type === 'studio' ? 'Stüdyo Çekimi' : type === 'story' ? 'Hikaye Post' : 'Referans Görsel'}</span>
                    {panel.completed && <Check className="w-5 h-5 text-green-600" />}
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Görsel Sayısı</label>
                      <select
                        value={panel.count}
                        onChange={(e) => updateVisualPanel(type, 'count', Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {[1, 2, 3, 4, 6, 9].map(num => (
                          <option key={num} value={num}>{num} Görsel</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Stil</label>
                      <select
                        value={panel.style}
                        onChange={(e) => updateVisualPanel(type, 'style', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Modern">Modern</option>
                        <option value="Minimal">Minimal</option>
                        <option value="Parlak">Parlak</option>
                        <option value="Karanlık">Karanlık</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <FileText className="w-3 h-3 inline mr-1" />
                      Görsel Açıklaması
                    </label>
                    <div className="relative">
                      <textarea
                        value={panel.description}
                        onChange={(e) => updateVisualPanel(type, 'description', e.target.value)}
                        placeholder="İstediğiniz görselin stilini, ruh halini, renklerini açıklayın"
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none pr-10"
                      />
                      <div className="absolute right-1 top-1 flex flex-col gap-1">
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={() => startVoiceRecording('visual', type)}
                            className="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
                            title="Sesli kayıt başlat"
                          >
                            <Mic className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => stopVoiceRecording('visual')}
                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors animate-pulse"
                            title="Kaydı durdur"
                          >
                            <MicOff className="w-3 h-3" />
                          </button>
                        )}
                        {panel.descriptionAudioUrl && (
                          <>
                            <button
                              type="button"
                              onClick={() => playAudio(panel.descriptionAudioUrl)}
                              className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                              title="Kaydı dinle"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => retryVoiceRecording('visual', type)}
                              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                              title="Yeniden kaydet"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Influencer</label>
                    <select
                      value={panel.influencer}
                      onChange={(e) => updateVisualPanel(type, 'influencer', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Influencer Seçiniz</option>
                      {influencers.map((inf) => (
                        <option key={inf.id} value={inf.id}>
                          {inf.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Platformlar</label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => toggleVisualPlatform(type, platform.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all ${
                            panel.platforms.includes(platform.id)
                              ? 'bg-blue-100 border-blue-500 text-blue-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {platform.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Görsel Boyutu</label>
                    <select
                      value={panel.size}
                      onChange={(e) => updateVisualPanel(type, 'size', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {IMAGE_SIZES.map((size) => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                      ))}
                    </select>
                  </div>

                  {type === 'reference' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Referans Modu <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`visual-reference-mode-${type}`}
                            checked={panel.referenceMode === 'exact'}
                            onChange={() => updateVisualPanel(type, 'referenceMode', 'exact')}
                            className="text-purple-600"
                          />
                          <span className="text-sm">Birebir Aynı Olsun</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`visual-reference-mode-${type}`}
                            checked={panel.referenceMode === 'similar'}
                            onChange={() => updateVisualPanel(type, 'referenceMode', 'similar')}
                            className="text-purple-600"
                          />
                          <span className="text-sm">Benzer Olsun</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => completeVisualPanel(type)}
                    disabled={panel.completed}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      panel.completed
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {panel.completed ? 'Tamamlandı' : 'Tamamla'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Product Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ürün Bilgileri</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ürün Kodu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="Örn: PRD-2024-001"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ürün Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ürün adını girin"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ürün Açıklaması
                </label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Ürün özelliklerini, avantajlarını ve kullanım alanlarını açıklayın..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Package className="w-4 h-4 inline mr-1" />
                    Stok Adedi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    placeholder="100"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Ürün Fiyatı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="129.99"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <LinkIcon className="w-4 h-4 inline mr-1" />
                  Ürünün Linki
                </label>
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://example.com/product"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <LinkIcon className="w-4 h-4 inline mr-1" />
                  Benzer (referans) ürünün linki
                </label>
                <input
                  type="url"
                  value={referenceProductUrl}
                  onChange={(e) => setReferenceProductUrl(e.target.value)}
                  placeholder="https://example.com/similar-product"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Video Creation Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                Video Oluşturma
              </h3>
              <div className="text-right text-xs">
                <label className="block text-gray-600 mb-1">Video Arka Planı</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVideoBackgroundImage(file);
                      setVideoBackgroundImageUrl(URL.createObjectURL(file));
                    }
                  }}
                  accept="image/*"
                  className="text-xs"
                />
                {videoBackgroundImageUrl && (
                  <img src={videoBackgroundImageUrl} className="w-16 h-16 object-cover rounded mt-1" alt="Background" />
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">Video Tipleri (Birden fazla seçebilirsiniz)</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => toggleVideoType('promo')}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 font-medium transition-all text-xs ${
                  selectedVideoTypes.includes('promo')
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Film className="w-5 h-5" />
                <span>Tanıtım</span>
                <span className="text-[10px]">Videosu</span>
              </button>
              <button
                onClick={() => toggleVideoType('story')}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 font-medium transition-all text-xs ${
                  selectedVideoTypes.includes('story')
                    ? 'bg-amber-50 border-amber-500 text-amber-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Play className="w-5 h-5" />
                <span>Hikaye</span>
                <span className="text-[10px]">Videosu</span>
              </button>
              <button
                onClick={() => toggleVideoType('reference')}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 font-medium transition-all text-xs ${
                  selectedVideoTypes.includes('reference')
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Referans Video</span>
                <span className="text-[10px]">(Trendler)</span>
              </button>
            </div>

            {selectedVideoTypes.map((type) => {
              const panel = videoPanels[type];
              const isRecording = isRecordingVideo === type;

              return (
                <div key={type} className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3 space-y-3">
                  <h4 className="font-semibold text-sm text-gray-900 capitalize flex items-center justify-between">
                    <span>{type === 'promo' ? 'Tanıtım Videosu' : type === 'story' ? 'Hikaye Videosu' : 'Referans Video'}</span>
                    {panel.completed && <Check className="w-5 h-5 text-green-600" />}
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Video Sayısı</label>
                    <select
                      value={panel.count}
                      onChange={(e) => updateVideoPanel(type, 'count', Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {[1, 2, 3].map(num => (
                        <option key={num} value={num}>{num} Video</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Platformlar</label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => toggleVideoPlatform(type, platform.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all ${
                            panel.platforms.includes(platform.id)
                              ? 'bg-red-100 border-red-500 text-red-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {platform.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <FileText className="w-3 h-3 inline mr-1" />
                      Video Açıklaması
                    </label>
                    <div className="relative">
                      <textarea
                        value={panel.description}
                        onChange={(e) => updateVideoPanel(type, 'description', e.target.value)}
                        placeholder="Nasıl bir video istiyorsunuz?"
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none pr-10"
                      />
                      <div className="absolute right-1 top-1 flex flex-col gap-1">
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={() => startVoiceRecording('video', type)}
                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                            title="Sesli kayıt başlat"
                          >
                            <Mic className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => stopVoiceRecording('video')}
                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors animate-pulse"
                            title="Kaydı durdur"
                          >
                            <MicOff className="w-3 h-3" />
                          </button>
                        )}
                        {panel.descriptionAudioUrl && (
                          <>
                            <button
                              type="button"
                              onClick={() => playAudio(panel.descriptionAudioUrl)}
                              className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                              title="Kaydı dinle"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => retryVoiceRecording('video', type)}
                              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                              title="Yeniden kaydet"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Süre</label>
                      <select
                        value={panel.duration}
                        onChange={(e) => updateVideoPanel(type, 'duration', Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value={15}>15 saniye</option>
                        <option value={30}>30 saniye</option>
                        <option value={60}>60 saniye</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Stil</label>
                      <select
                        value={panel.style}
                        onChange={(e) => updateVideoPanel(type, 'style', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Ürün Vitrin">Ürün Vitrin</option>
                        <option value="Müşteri Yolculuğu">Müşteri Yolculuğu</option>
                        <option value="Trend">Trend</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Çağrı Metni</label>
                    <input
                      type="text"
                      value={panel.ctaText}
                      onChange={(e) => updateVideoPanel(type, 'ctaText', e.target.value)}
                      placeholder="Örn: Hemen Satın Al"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Influencer</label>
                    <select
                      value={panel.influencer}
                      onChange={(e) => updateVideoPanel(type, 'influencer', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Influencer Seçiniz</option>
                      {influencers.map((inf) => (
                        <option key={inf.id} value={inf.id}>
                          {inf.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Video Boyutu</label>
                    <select
                      value={panel.size}
                      onChange={(e) => updateVideoPanel(type, 'size', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {VIDEO_SIZES.map((size) => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                      ))}
                    </select>
                  </div>

                  {type === 'reference' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Referans Video Yükle</label>
                        <input
                          type="file"
                          onChange={(e) => handleReferenceVideoUpload(type, e)}
                          accept="video/*"
                          className="w-full text-sm"
                        />
                        {panel.referenceVideoUrl && (
                          <video src={panel.referenceVideoUrl} className="w-full h-24 object-cover rounded mt-2" controls />
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Referans Modu <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`video-reference-mode-${type}`}
                              checked={panel.referenceMode === 'exact'}
                              onChange={() => updateVideoPanel(type, 'referenceMode', 'exact')}
                              className="text-red-600"
                            />
                            <span className="text-sm">Birebir Aynı Olsun</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`video-reference-mode-${type}`}
                              checked={panel.referenceMode === 'similar'}
                              onChange={() => updateVideoPanel(type, 'referenceMode', 'similar')}
                              className="text-red-600"
                            />
                            <span className="text-sm">Benzer Olsun</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Ses Kullanımı</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`video-audio-${type}`}
                              checked={panel.useOriginalAudio}
                              onChange={() => updateVideoPanel(type, 'useOriginalAudio', true)}
                              className="text-red-600"
                            />
                            <span className="text-sm">Orijinal sesi kullan</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`video-audio-${type}`}
                              checked={!panel.useOriginalAudio}
                              onChange={() => updateVideoPanel(type, 'useOriginalAudio', false)}
                              className="text-red-600"
                            />
                            <span className="text-sm">Yeni ses kullan</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => completeVideoPanel(type)}
                    disabled={panel.completed}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      panel.completed
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {panel.completed ? 'Tamamlandı' : 'Tamamla'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Keywords and Target Audience */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-600" />
          Anahtar Kelimeler ve Hedef Kitle
        </h3>
        <p className="text-sm text-blue-600 mb-4">
          Yapay zekamız bu bilgileri otomatik olarak analiz edip önerilerde sunar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anahtar Kelimeler
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="elbise, kadife, sonbahar, şık, zarif"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1.5">Virgülle ayırarak yazın</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Hedef Kitle
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="genç kadınlar, minimalist tarz, 25-35 yaş arası"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1.5">Hedef kitlenizi tanımlayın</p>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-red-900 mb-2">Lütfen aşağıdaki hataları düzeltin:</h4>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Create Product Button */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
        <p className="text-sm text-gray-600 mb-4">
          Hedef kitlenizi tanımlayın
        </p>
        <button
          onClick={handleCreateProduct}
          disabled={isCreatingProduct}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-5 rounded-xl font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
        >
          {isCreatingProduct ? (
            <>
              <Loader className="w-7 h-7 animate-spin" />
              Ürün Oluşturuluyor...
            </>
          ) : (
            <>
              <Sparkles className="w-7 h-7" />
              Ürün Oluştur
            </>
          )}
        </button>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Fotoğraf Çek</h3>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
              {!capturedImage ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3">
              {!capturedImage ? (
                <>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Fotoğraf Çek
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={confirmCapture}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    Kullan
                  </button>
                  <button
                    onClick={retakePhoto}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Yeniden Çek
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
