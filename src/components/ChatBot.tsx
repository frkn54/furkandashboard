import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Size nasil yardimci olabilirim?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isOnCall, setIsOnCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponses = [
        'Anliyorum, bu konuda size yardimci olabilirim.',
        'Elbette, hemen kontrol ediyorum.',
        'Bu bilgiyi sizinle paylasabilirim.',
        'Daha fazla detay verebilir misiniz?',
        'Siparisleriniz hakkinda bilgi almak icin "siparisler" yazabilirsiniz.',
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        const voiceMessage: Message = {
          id: Date.now().toString(),
          text: '[Ses mesaji algilandi] Siparislerimi gormek istiyorum',
          sender: 'user',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, voiceMessage]);

        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: 'Siparislerinizi kontrol ediyorum. Su an 3 aktif siparisleriniz bulunmaktadir.',
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        }, 1000);
      }, 3000);
    }
  };

  const toggleCall = () => {
    setIsOnCall(!isOnCall);
  };

  return (
    <div className="mb-[20px]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-[50px] bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-sm flex items-center justify-center gap-2 text-white transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">Kisisel Asistan</span>
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: '365px' }}>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="font-semibold text-white text-sm">Kisisel Asistan</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleCall}
                className={`p-1.5 rounded-lg transition-colors ${
                  isOnCall ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {isOnCall ? (
                  <PhoneOff className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Phone className="w-3.5 h-3.5 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {isOnCall && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-700 text-xs font-medium">Sesli gorusme aktif - Konusabilirsiniz</span>
            </div>
          )}

          <div className="h-[240px] overflow-y-auto p-3 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
                    message.sender === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-2 flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajinizi yazin..."
              className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
