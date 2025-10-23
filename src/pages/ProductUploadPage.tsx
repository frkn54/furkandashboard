import { useState, useEffect, useRef } from 'react';
import { Upload, Sparkles, Video, Image as ImageIcon, Check, X, Loader, Instagram, Facebook, Twitter, Zap, Globe, Camera, Image, Play, Film, Scroll, Mic, MicOff, Volume2, RefreshCw, FileText, Tag, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Influencer } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface GeneratedContent {
  id: string;
  type: 'image' | 'video';
  videoType?: 'promotional' | 'story';
  url: string;
  platforms: string[];
  influencerId?: string;
}

const PLATFORMS: Platform[] = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
  { id: 'tiktok', name: 'TikTok', icon: <Zap className="w-4 h-4" /> },
  { id: 'pinterest', name: 'Pinterest', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'website-product', name: 'Web Ürün', icon: <Globe className="w-4 h-4" /> },
];

const SAMPLE_GENERATED_IMAGES = [
  'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const SAMPLE_GENERATED_VIDEOS = [
  'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function ProductUploadPage() {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [imageCount, setImageCount] = useState(4);
  const [promotionalVideoCount, setPromotionalVideoCount] = useState(1);
  const [storyVideoCount, setStoryVideoCount] = useState(1);
  const [imageStyle, setImageStyle] = useState('modern');
  const [imageVisualDescription, setImageVisualDescription] = useState('');
  const [selectedImageInfluencer, setSelectedImageInfluencer] = useState('');
  const [selectedVideoInfluencer, setSelectedVideoInfluencer] = useState('');

  const [isRecordingImage, setIsRecordingImage] = useState(false);
  const [isRecordingPromotionalVideo, setIsRecordingPromotionalVideo] = useState(false);
  const [isRecordingStoryVideo, setIsRecordingStoryVideo] = useState(false);
  const [imageAudioUrl, setImageAudioUrl] = useState<string | null>(null);
  const [promotionalVideoAudioUrl, setPromotionalVideoAudioUrl] = useState<string | null>(null);
  const [storyVideoAudioUrl, setStoryVideoAudioUrl] = useState<string | null>(null);
  const [isProcessingImageSpeech, setIsProcessingImageSpeech] = useState(false);
  const [isProcessingPromotionalVideoSpeech, setIsProcessingPromotionalVideoSpeech] = useState(false);
  const [isProcessingStoryVideoSpeech, setIsProcessingStoryVideoSpeech] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const [selectedVideoTypes, setSelectedVideoTypes] = useState<('promotional' | 'story')[]>(['promotional']);
  const [promotionalVideoStyle, setPromotionalVideoStyle] = useState('showcase');
  const [promotionalVideoDuration, setPromotionalVideoDuration] = useState(30);
  const [promotionalVideoDescription, setPromotionalVideoDescription] = useState('');
  const [promotionalVideoInfluencer, setPromotionalVideoInfluencer] = useState('');
  const [callToAction, setCallToAction] = useState('');

  const [storyVideoStyle, setStoryVideoStyle] = useState('customer-journey');
  const [storyVideoDuration, setStoryVideoDuration] = useState(30);
  const [storyVideoDescription, setStoryVideoDescription] = useState('');
  const [storyVideoInfluencer, setStoryVideoInfluencer] = useState('');
  const [narrativeTone, setNarrativeTone] = useState('inspirational');

  const [selectedImagePlatforms, setSelectedImagePlatforms] = useState<string[]>([]);
  const [selectedPromotionalVideoPlatforms, setSelectedPromotionalVideoPlatforms] = useState<string[]>([]);
  const [selectedStoryVideoPlatforms, setSelectedStoryVideoPlatforms] = useState<string[]>([]);

  const [imagesCompleted, setImagesCompleted] = useState(false);
  const [videosCompleted, setVideosCompleted] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productCreated, setProductCreated] = useState(false);

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformMetadata, setPlatformMetadata] = useState<{[key: string]: {
    title: string;
    description: string;
    metaTitle: string;
    metaKeywords: string;
    targetAudience: string;
  }}>({});

  const [generatedImages, setGeneratedImages] = useState<GeneratedContent[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedContent[]>([]);

  const [showResults, setShowResults] = useState(false);

  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

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
      alert('Kamera erişimi sağlanamadı. Lütfen izinleri kontrol edin.');
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

  const confirmCapture = () => {
    if (capturedImage) {
      setPreviewUrl(capturedImage);
      stopCamera();
      setCapturedImage(null);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const toggleImagePlatform = (platformId: string) => {
    setSelectedImagePlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const togglePromotionalVideoPlatform = (platformId: string) => {
    setSelectedPromotionalVideoPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const toggleStoryVideoPlatform = (platformId: string) => {
    setSelectedStoryVideoPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerateImages = async () => {
    setImagesCompleted(true);
  };

  const handleGenerateVideos = async () => {
    setVideosCompleted(true);
  };

  const handleApproveContent = (contentId: string) => {
    console.log('Approved:', contentId);
  };

  const handleRejectContent = (contentId: string) => {
    setGeneratedImages(prev => prev.filter(item => item.id !== contentId));
    setGeneratedVideos(prev => prev.filter(item => item.id !== contentId));
  };

  const handlePublishAll = () => {
    alert(`${generatedImages.length + generatedVideos.length} içerik yayınlanacak!`);
  };

  const getInfluencerName = (influencerId: string) => {
    const influencer = influencers.find(inf => inf.id === influencerId);
    return influencer ? influencer.name : 'Bilinmeyen';
  };

  const toggleVideoType = (type: 'promotional' | 'story') => {
    setSelectedVideoTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const togglePlatformSelection = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const updatePlatformMetadata = (platformId: string, field: string, value: string) => {
    setPlatformMetadata(prev => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        title: prev[platformId]?.title || productName,
        description: prev[platformId]?.description || productDescription,
        metaTitle: prev[platformId]?.metaTitle || '',
        metaKeywords: prev[platformId]?.metaKeywords || keywords,
        targetAudience: prev[platformId]?.targetAudience || targetAudience,
        [field]: value
      }
    }));
  };

  const handleCreateProduct = async () => {
    setIsCreatingProduct(true);

    const images: GeneratedContent[] = SAMPLE_GENERATED_IMAGES.slice(0, imageCount).map((url, index) => ({
      id: `img-${Date.now()}-${index}`,
      type: 'image' as const,
      url,
      platforms: [...selectedImagePlatforms],
      influencerId: selectedImageInfluencer,
    }));

    const videos: GeneratedContent[] = [];
    let videoIndex = 0;

    selectedVideoTypes.forEach((type) => {
      const count = type === 'promotional' ? promotionalVideoCount : storyVideoCount;
      const platforms = type === 'promotional' ? selectedPromotionalVideoPlatforms : selectedStoryVideoPlatforms;
      const influencer = type === 'promotional' ? promotionalVideoInfluencer : storyVideoInfluencer;

      const typeVideos = SAMPLE_GENERATED_VIDEOS.slice(videoIndex, videoIndex + count).map((url, index) => ({
        id: `vid-${type}-${Date.now()}-${index}`,
        type: 'video' as const,
        videoType: type,
        url,
        platforms: [...platforms],
        influencerId: influencer,
      }));
      videos.push(...typeVideos);
      videoIndex += count;
    });

    setGeneratedImages(images);
    setGeneratedVideos(videos);

    const webhookData = {
      product: {
        code: productCode,
        name: productName,
        description: productDescription,
        keywords: keywords,
        targetAudience: targetAudience,
        previewUrl: previewUrl,
      },
      imageGeneration: {
        count: imageCount,
        style: imageStyle,
        visualDescription: imageVisualDescription,
        influencerId: selectedImageInfluencer,
        platforms: selectedImagePlatforms,
        audioUrl: imageAudioUrl,
      },
      videoGeneration: {
        selectedTypes: selectedVideoTypes,
        promotional: selectedVideoTypes.includes('promotional') ? {
          count: promotionalVideoCount,
          style: promotionalVideoStyle,
          duration: promotionalVideoDuration,
          description: promotionalVideoDescription,
          influencerId: promotionalVideoInfluencer,
          callToAction: callToAction,
          platforms: selectedPromotionalVideoPlatforms,
          audioUrl: promotionalVideoAudioUrl,
        } : null,
        story: selectedVideoTypes.includes('story') ? {
          count: storyVideoCount,
          style: storyVideoStyle,
          duration: storyVideoDuration,
          description: storyVideoDescription,
          influencerId: storyVideoInfluencer,
          narrativeTone: narrativeTone,
          platforms: selectedStoryVideoPlatforms,
          audioUrl: storyVideoAudioUrl,
        } : null,
      },
      generatedContent: {
        images: images.map(img => ({
          id: img.id,
          url: img.url,
          platforms: img.platforms,
          influencerId: img.influencerId,
        })),
        videos: videos.map(vid => ({
          id: vid.id,
          videoType: vid.videoType,
          url: vid.url,
          platforms: vid.platforms,
          influencerId: vid.influencerId,
        })),
      },
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('https://n8n.furkaneskicioglu.com/webhook-test/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        console.error('Webhook failed:', response.status);
      }
    } catch (error) {
      console.error('Webhook error:', error);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreatingProduct(false);
    setProductCreated(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handlePublishToAllPlatforms = async () => {
    alert(`${selectedPlatforms.length} platforma içerik yayınlanacak!`);
  };

  const startImageVoiceRecording = async (type: 'image' | 'promotional-video' | 'story-video') => {
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

        if (type === 'image') {
          setImageAudioUrl(audioUrl);
        } else if (type === 'promotional-video') {
          setPromotionalVideoAudioUrl(audioUrl);
        } else {
          setStoryVideoAudioUrl(audioUrl);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();

      if (recognitionRef.current) {
        if (type === 'image') {
          setIsProcessingImageSpeech(true);
        } else if (type === 'promotional-video') {
          setIsProcessingPromotionalVideoSpeech(true);
        } else {
          setIsProcessingStoryVideoSpeech(true);
        }

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            }
          }

          if (finalTranscript) {
            if (type === 'image') {
              setImageVisualDescription(prev => prev + finalTranscript);
            } else if (type === 'promotional-video') {
              setPromotionalVideoDescription(prev => prev + finalTranscript);
            } else {
              setStoryVideoDescription(prev => prev + finalTranscript);
            }
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          alert('Ses tanıma hatası: ' + event.error);
        };

        recognitionRef.current.start();
      }

      if (type === 'image') {
        setIsRecordingImage(true);
      } else if (type === 'promotional-video') {
        setIsRecordingPromotionalVideo(true);
      } else {
        setIsRecordingStoryVideo(true);
      }
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Mikrofon erişimi sağlanamadı. Lütfen izinleri kontrol edin.');
    }
  };

  const stopVoiceRecording = (type: 'image' | 'promotional-video' | 'story-video') => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (type === 'image') {
      setIsRecordingImage(false);
      setIsProcessingImageSpeech(false);
    } else if (type === 'promotional-video') {
      setIsRecordingPromotionalVideo(false);
      setIsProcessingPromotionalVideoSpeech(false);
    } else {
      setIsRecordingStoryVideo(false);
      setIsProcessingStoryVideoSpeech(false);
    }
  };

  const playAudio = (audioUrl: string | null) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const retryVoiceRecording = (type: 'image' | 'promotional-video' | 'story-video') => {
    if (type === 'image') {
      setImageVisualDescription('');
      setImageAudioUrl(null);
    } else if (type === 'promotional-video') {
      setPromotionalVideoDescription('');
      setPromotionalVideoAudioUrl(null);
    } else {
      setStoryVideoDescription('');
      setStoryVideoAudioUrl(null);
    }
    startImageVoiceRecording(type);
  };

  const isWebProduct = selectedImagePlatforms.includes('website-product') || selectedPromotionalVideoPlatforms.includes('website-product') || selectedStoryVideoPlatforms.includes('website-product');

  return (
    <div className="max-w-full px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Ürün Referans Görseli
            </h3>

            <div className="space-y-3">
              <div className="h-40 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Ürün görseli</p>
                  </div>
                )}
              </div>

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
                  <Image className="w-4 h-4" />
                  Galeri
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Side-by-side layout for Image and Video Generation */}
          <div className="grid grid-cols-2 gap-6">
            {/* Image Generation Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-purple-600" />
                Görsel Oluşturma
              </h3>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Görsel Sayısı</label>
                  <select
                    value={imageCount}
                    onChange={(e) => setImageCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} Görsel</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stil</label>
                  <select
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="luxury">Lüks</option>
                    <option value="vintage">Vintage</option>
                    <option value="colorful">Renkli</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Görsel Açıklaması
                </label>
                <div className="relative">
                  <textarea
                    value={imageVisualDescription}
                    onChange={(e) => setImageVisualDescription(e.target.value)}
                    placeholder="İstediğiniz görselin stilini, ruh halini, renklerini, konularını ve kompozisyonunu açıklayın. Örn: Modern ve minimal stil, parlak renkler, ürün merkezli, beyaz arka plan"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none pr-12"
                  />
                  <div className="absolute right-2 top-2 flex flex-col gap-1">
                    {!isRecordingImage ? (
                      <button
                        type="button"
                        onClick={() => startImageVoiceRecording('image')}
                        className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                        title="Sesli kayıt başlat"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => stopVoiceRecording('image')}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors animate-pulse"
                        title="Kaydı durdur"
                      >
                        <MicOff className="w-4 h-4" />
                      </button>
                    )}
                    {imageAudioUrl && (
                      <>
                        <button
                          type="button"
                          onClick={() => playAudio(imageAudioUrl)}
                          className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                          title="Kaydı dinle"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => retryVoiceRecording('image')}
                          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                          title="Yeniden kaydet"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {isRecordingImage && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    {isProcessingImageSpeech ? 'Ses kaydediliyor ve metne dönüştürülüyor...' : 'Kayıt devam ediyor...'}
                  </div>
                )}
                {imageAudioUrl && !isRecordingImage && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                    <Check className="w-3 h-3" />
                    Ses kaydı tamamlandı. Metni düzenleyebilir veya kaydı dinleyebilirsiniz.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Influencer</label>
                <select
                  value={selectedImageInfluencer}
                  onChange={(e) => setSelectedImageInfluencer(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Influencer Seçiniz</option>
                  {influencers.map((inf, idx) => (
                    <option key={inf.id} value={inf.id}>
                      Influencer {idx + 1} - {inf.name}
                    </option>
                  ))}
                </select>
                {influencers.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    Henüz influencer oluşturmadınız. Marka Yönetimi &gt; Influencer Yaratma sayfasından oluşturabilirsiniz.
                  </p>
                )}
              </div>

              {!isWebProduct && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platformlar</label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.filter(p => p.id !== 'website-product').map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => toggleImagePlatform(platform.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          selectedImagePlatforms.includes(platform.id)
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {platform.icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isWebProduct && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">Web Ürün</p>
                </div>
              )}

              <button
                onClick={handleGenerateImages}
                disabled={imagesCompleted || !productCode || !productName}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${
                  imagesCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white disabled:opacity-50'
                }`}
              >
                {imagesCompleted ? (
                  <>
                    <Check className="w-6 h-6" />
                    Tamamlandı
                  </>
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    Tamamla
                  </>
                )}
              </button>
            </div>
            </div>

            {/* Video Generation Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Video className="w-6 h-6 text-red-600" />
                Video Oluşturma
              </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Video Tipleri (Birden fazla seçebilirsiniz)</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleVideoType('promotional')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedVideoTypes.includes('promotional')
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Film className="w-5 h-5" />
                    Tanıtım Videosu
                  </button>
                  <button
                    onClick={() => toggleVideoType('story')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedVideoTypes.includes('story')
                        ? 'bg-amber-50 border-amber-500 text-amber-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Scroll className="w-5 h-5" />
                    Hikaye Videosu
                  </button>
                </div>
              </div>

              {selectedVideoTypes.includes('promotional') && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-100 space-y-4">
                  <h4 className="text-base font-semibold text-red-700 mb-2">Tanıtım Videosu Ayarları</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Sayısı</label>
                    <select
                      value={promotionalVideoCount}
                      onChange={(e) => setPromotionalVideoCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value={1}>1 Video</option>
                      <option value={2}>2 Video</option>
                      <option value={3}>3 Video</option>
                    </select>
                  </div>

                  {!isWebProduct && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platformlar</label>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORMS.filter(p => p.id !== 'website-product').map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() => togglePromotionalVideoPlatform(platform.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                              selectedPromotionalVideoPlatforms.includes(platform.id)
                                ? 'bg-red-100 border-red-500 text-red-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {platform.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Video Açıklaması
                    </label>
                    <div className="relative">
                      <textarea
                        value={promotionalVideoDescription}
                        onChange={(e) => setPromotionalVideoDescription(e.target.value)}
                        placeholder="Nasıl bir tanıtım videosu istiyorsunuz? Örn: Ürünün özelliklerini vurgulayan dinamik bir video, hızlı geçişler, enerjik müzik"
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none pr-12"
                      />
                      <div className="absolute right-2 top-2 flex flex-col gap-1">
                        {!isRecordingPromotionalVideo ? (
                          <button
                            type="button"
                            onClick={() => startImageVoiceRecording('promotional-video')}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                            title="Sesli kayıt başlat"
                          >
                            <Mic className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => stopVoiceRecording('promotional-video')}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors animate-pulse"
                            title="Kaydı durdur"
                          >
                            <MicOff className="w-4 h-4" />
                          </button>
                        )}
                        {promotionalVideoAudioUrl && (
                          <>
                            <button
                              type="button"
                              onClick={() => playAudio(promotionalVideoAudioUrl)}
                              className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                              title="Kaydı dinle"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => retryVoiceRecording('promotional-video')}
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                              title="Yeniden kaydet"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isRecordingPromotionalVideo && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        {isProcessingPromotionalVideoSpeech ? 'Ses kaydediliyor ve metne dönüştürülüyor...' : 'Kayıt devam ediyor...'}
                      </div>
                    )}
                    {promotionalVideoAudioUrl && !isRecordingPromotionalVideo && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                        <Check className="w-3 h-3" />
                        Ses kaydı tamamlandı. Metni düzenleyebilir veya kaydı dinleyebilirsiniz.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Süre</label>
                      <select
                        value={promotionalVideoDuration}
                        onChange={(e) => setPromotionalVideoDuration(Number(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value={15}>15 saniye</option>
                        <option value={30}>30 saniye</option>
                        <option value={60}>60 saniye</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stil</label>
                      <select
                        value={promotionalVideoStyle}
                        onChange={(e) => setPromotionalVideoStyle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="showcase">Ürün Vitrin</option>
                        <option value="features">Özellik Vurgulama</option>
                        <option value="comparison">Karşılaştırma</option>
                        <option value="benefits">Fayda Odaklı</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Çağrı Metni</label>
                      <input
                        type="text"
                        value={callToAction}
                        onChange={(e) => setCallToAction(e.target.value)}
                        placeholder="Örn: Hemen Satın Al, Bugün Sipariş Ver"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Influencer</label>
                      <select
                        value={promotionalVideoInfluencer}
                        onChange={(e) => setPromotionalVideoInfluencer(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Influencer Seçiniz</option>
                        {influencers.map((inf, idx) => (
                          <option key={inf.id} value={inf.id}>
                            Influencer {idx + 1} - {inf.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedVideoTypes.includes('story') && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 space-y-4">
                  <h4 className="text-base font-semibold text-amber-700 mb-2">Hikaye Videosu Ayarları</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Sayısı</label>
                    <select
                      value={storyVideoCount}
                      onChange={(e) => setStoryVideoCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value={1}>1 Video</option>
                      <option value={2}>2 Video</option>
                      <option value={3}>3 Video</option>
                    </select>
                  </div>

                  {!isWebProduct && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platformlar</label>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORMS.filter(p => p.id !== 'website-product').map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() => toggleStoryVideoPlatform(platform.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                              selectedStoryVideoPlatforms.includes(platform.id)
                                ? 'bg-amber-100 border-amber-500 text-amber-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {platform.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Hikaye Anlatımı
                    </label>
                    <div className="relative">
                      <textarea
                        value={storyVideoDescription}
                        onChange={(e) => setStoryVideoDescription(e.target.value)}
                        placeholder="Nasıl bir hikaye anlatmak istiyorsunuz? Örn: Ürünün müşteri hayatındaki dönüşümü, duygusal bağlantı, ilham verici müzik"
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none pr-12"
                      />
                      <div className="absolute right-2 top-2 flex flex-col gap-1">
                        {!isRecordingStoryVideo ? (
                          <button
                            type="button"
                            onClick={() => startImageVoiceRecording('story-video')}
                            className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
                            title="Sesli kayıt başlat"
                          >
                            <Mic className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => stopVoiceRecording('story-video')}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors animate-pulse"
                            title="Kaydı durdur"
                          >
                            <MicOff className="w-4 h-4" />
                          </button>
                        )}
                        {storyVideoAudioUrl && (
                          <>
                            <button
                              type="button"
                              onClick={() => playAudio(storyVideoAudioUrl)}
                              className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                              title="Kaydı dinle"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => retryVoiceRecording('story-video')}
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                              title="Yeniden kaydet"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isRecordingStoryVideo && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        {isProcessingStoryVideoSpeech ? 'Ses kaydediliyor ve metne dönüştürülüyor...' : 'Kayıt devam ediyor...'}
                      </div>
                    )}
                    {storyVideoAudioUrl && !isRecordingStoryVideo && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                        <Check className="w-3 h-3" />
                        Ses kaydı tamamlandı. Metni düzenleyebilir veya kaydı dinleyebilirsiniz.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Süre</label>
                      <select
                        value={storyVideoDuration}
                        onChange={(e) => setStoryVideoDuration(Number(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value={30}>30 saniye</option>
                        <option value={60}>60 saniye</option>
                        <option value={90}>90 saniye</option>
                        <option value={120}>2 dakika</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Anlatım Tonu</label>
                      <select
                        value={narrativeTone}
                        onChange={(e) => setNarrativeTone(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="inspirational">İlham Verici</option>
                        <option value="educational">Eğitici</option>
                        <option value="entertainment">Eğlenceli</option>
                        <option value="documentary">Belgesel Tarzı</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hikaye Stili</label>
                      <select
                        value={storyVideoStyle}
                        onChange={(e) => setStoryVideoStyle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="customer-journey">Müşteri Yolculuğu</option>
                        <option value="behind-scenes">Perde Arkası</option>
                        <option value="problem-solution">Problem-Çözüm</option>
                        <option value="brand-story">Marka Hikayesi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Influencer</label>
                      <select
                        value={storyVideoInfluencer}
                        onChange={(e) => setStoryVideoInfluencer(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Influencer Seçiniz</option>
                        {influencers.map((inf, idx) => (
                          <option key={inf.id} value={inf.id}>
                            Influencer {idx + 1} - {inf.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerateVideos}
                disabled={videosCompleted || !productCode || !productName || selectedVideoTypes.length === 0}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${
                  videosCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white disabled:opacity-50'
                }`}
              >
                {videosCompleted ? (
                  <>
                    <Check className="w-6 h-6" />
                    Tamamlandı
                  </>
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    Tamamla
                  </>
                )}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>

      {showResults && (generatedImages.length > 0 || generatedVideos.length > 0) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Oluşturulan İçerikler</h3>
            <button
              onClick={handlePublishAll}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
            >
              <Check className="w-4 h-4" />
              Tümünü Yayınla ({generatedImages.length + generatedVideos.length})
            </button>
          </div>

          {generatedImages.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Görseller ({generatedImages.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {generatedImages.map((image) => (
                  <div key={image.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt="Generated"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-3 space-y-2">
                      {image.influencerId && (
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Influencer:</span> {getInfluencerName(image.influencerId)}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {image.platforms.map((platformId) => {
                          const platform = PLATFORMS.find(p => p.id === platformId);
                          return platform ? (
                            <span key={platformId} className="inline-flex items-center p-1 bg-blue-100 text-blue-700 rounded">
                              {platform.icon}
                            </span>
                          ) : null;
                        })}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveContent(image.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Onayla
                        </button>
                        <button
                          onClick={() => handleRejectContent(image.id)}
                          className="flex items-center justify-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generatedVideos.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                Videolar ({generatedVideos.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedVideos.map((video) => (
                  <div key={video.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                    <div className="aspect-video overflow-hidden relative">
                      <img src={video.url} alt="Video thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-red-600 ml-1" />
                        </div>
                      </div>
                      {video.videoType && (
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            video.videoType === 'promotional'
                              ? 'bg-red-500 text-white'
                              : 'bg-amber-500 text-white'
                          }`}>
                            {video.videoType === 'promotional' ? 'Tanıtım' : 'Hikaye'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 space-y-2">
                      {video.influencerId && (
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Influencer:</span> {getInfluencerName(video.influencerId)}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {video.platforms.map((platformId) => {
                          const platform = PLATFORMS.find(p => p.id === platformId);
                          return platform ? (
                            <span key={platformId} className="inline-flex items-center p-1 bg-blue-100 text-blue-700 rounded">
                              {platform.icon}
                            </span>
                          ) : null;
                        })}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveContent(video.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Onayla
                        </button>
                        <button
                          onClick={() => handleRejectContent(video.id)}
                          className="flex items-center justify-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-600" />
          Anahtar Kelimeler ve Hedef Kitle
        </h3>
        <p className="text-sm text-blue-600 mb-4 flex items-start gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
          Yapay zekamız bu bilgileri otomatik olarak analiz edip önerilerde sunar.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anahtar Kelimeler
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="elbise, kadife, sonbahar, şık, zarif"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1.5">Hedef kitlenizi tanımlayın</p>
          </div>
        </div>

        <button
          onClick={handleCreateProduct}
          disabled={isCreatingProduct || !productCode || !productName}
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

      {productCreated && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Check className="w-6 h-6 text-green-600" />
            Ürün Başarıyla Oluşturuldu
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Oluşturulan Görseller</h4>
              <div className="grid grid-cols-2 gap-3">
                {generatedImages.slice(0, 4).map((image) => (
                  <div key={image.id} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={image.url} alt="Generated" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Yapay Zeka Tarafından Üretilen İçerik</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Ürün Başlığı</p>
                    <p className="text-gray-900">{productName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">AI Açıklaması</p>
                    <p className="text-gray-600 text-sm">{productDescription || 'Yapay zeka tarafından oluşturulan ürün açıklaması burada görünecek...'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Anahtar Kelimeler</p>
                    <p className="text-gray-600 text-sm">{keywords || 'modern, şık, kaliteli, trend'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {productCreated && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Ürün Paylaşımı
            </h4>
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Paylaşım Platformlarını Seçin</h5>
                <div className="flex flex-wrap gap-3 mb-6">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatformSelection(platform.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {platform.icon}
                      <span className="text-sm">{platform.name}</span>
                    </button>
                  ))}
                </div>

                {selectedPlatforms.length > 0 && (
                  <div className="space-y-4">
                    {selectedPlatforms.map((platformId) => {
                      const platform = PLATFORMS.find(p => p.id === platformId);
                      return (
                        <div key={platformId} className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-4">
                            {platform?.icon}
                            <h5 className="text-lg font-semibold text-gray-900">{platform?.name}</h5>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ürün İsmi
                              </label>
                              <input
                                type="text"
                                value={platformMetadata[platformId]?.title || productName}
                                onChange={(e) => updatePlatformMetadata(platformId, 'title', e.target.value)}
                                placeholder="Ürün ismi"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Başlık
                              </label>
                              <input
                                type="text"
                                value={platformMetadata[platformId]?.metaTitle || ''}
                                onChange={(e) => updatePlatformMetadata(platformId, 'metaTitle', e.target.value)}
                                placeholder="SEO meta başlığı"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Paylaşım Açıklaması
                            </label>
                            <textarea
                              value={platformMetadata[platformId]?.description || productDescription}
                              onChange={(e) => updatePlatformMetadata(platformId, 'description', e.target.value)}
                              placeholder="Platformda görünecek açıklama"
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Anahtar Kelimeler
                              </label>
                              <input
                                type="text"
                                value={platformMetadata[platformId]?.metaKeywords || keywords}
                                onChange={(e) => updatePlatformMetadata(platformId, 'metaKeywords', e.target.value)}
                                placeholder="anahtar, kelimeler"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hedef Kitle
                              </label>
                              <input
                                type="text"
                                value={platformMetadata[platformId]?.targetAudience || targetAudience}
                                onChange={(e) => updatePlatformMetadata(platformId, 'targetAudience', e.target.value)}
                                placeholder="Hedef kitle"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedPlatforms.length > 0 && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handlePublishToAllPlatforms}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-5 rounded-xl font-bold text-xl transition-all shadow-xl hover:shadow-2xl"
                    >
                      <Sparkles className="w-7 h-7" />
                      Paylaş
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
      )}

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
