import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Plus, 
  History, 
  Trash2, 
  X,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import FooterCredit from '@/components/FooterCredit';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/lib/AuthContext';

export default function CoachChat() {
  const { t, isRTL, getAIResponseLanguageName } = useLanguage();
  const { user } = useAuth();
  
  // Storage Keys
  const CHATS_KEY = user ? `coach_chats_v3_${user.uid}` : 'coach_chats_v3_guest';
  const ACTIVE_ID_KEY = user ? `coach_active_id_${user.uid}` : 'coach_active_id_guest';

  // State
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(CHATS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem(ACTIVE_ID_KEY) || null;
  });

  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(null);
  const messagesEndRef = useRef(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const getInitialMessage = () => t('coachInitialMessage');

  // Initialization: Create first chat if none exist
  useEffect(() => {
    if (chats.length === 0) {
      const newChat = {
        id: Date.now().toString(),
        title: t('untitledChat'),
        messages: [{ role: 'coach', content: getInitialMessage() }],
        createdAt: new Date().toISOString()
      };
      setChats([newChat]);
      setActiveChatId(newChat.id);
    } else if (!activeChatId || !chats.find(c => c.id === activeChatId)) {
      setActiveChatId(chats[0].id);
    }
  }, [chats.length, activeChatId]);

  // Persist State
  useEffect(() => {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }, [chats, CHATS_KEY]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem(ACTIVE_ID_KEY, activeChatId);
    }
  }, [activeChatId, ACTIVE_ID_KEY]);

  // Viewport/Keyboard Handling
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      const offset = window.innerHeight - vv.height;
      setKeyboardOffset(offset > 0 ? offset : 0);
    };
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
    };
  }, []);

  const currentChat = chats.find(c => c.id === activeChatId) || (chats.length > 0 ? chats[0] : null);
  const messages = currentChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, activeChatId, loading]);

  // Actions
  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: t('untitledChat'),
      messages: [{ role: 'coach', content: getInitialMessage() }],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setShowHistory(false);
  };

  const deleteChat = (id, e) => {
    e.stopPropagation();
    if (!window.confirm(t('confirmDeleteChat'))) return;
    
    const newChats = chats.filter(c => c.id !== id);
    setChats(newChats);
    if (activeChatId === id) {
      setActiveChatId(newChats.length > 0 ? newChats[0].id : null);
    }
  };

  const speakText = (text, index) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speaking === index) {
        setSpeaking(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeaking(null);
      utterance.onerror = () => setSpeaking(null);
      window.speechSynthesis.speak(utterance);
      setSpeaking(index);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !activeChatId) return;

    const userMessage = { role: 'user', content: input };
    const currentInput = input;
    setInput('');
    setLoading(true);

    // Update messages in state immediately
    let updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        const newMessages = [...c.messages, userMessage];
        // Auto-name untitled chat on first user message
        let newTitle = c.title;
        if (c.title === t('untitledChat')) {
          newTitle = currentInput.length > 30 ? currentInput.substring(0, 30) + '...' : currentInput;
        }
        return { ...c, messages: newMessages, title: newTitle };
      }
      return c;
    });
    setChats(updatedChats);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY') {
      const errorMsg = { role: 'coach', content: t('coachMissingApiKey') };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, errorMsg] } : c));
      setLoading(false);
      return;
    }

    try {
      const userProfile = JSON.parse(localStorage.getItem('fitegypt_user_profile') || '{}');
      const profileContext = userProfile.goal 
        ? `\n\nUser Profile:\n- Goal: ${userProfile.goal}\n- Weight: ${userProfile.weight || 'unknown'} kg`
        : '';

      const systemPrompt = `You are Coach, an energetic and motivating gym personal trainer. Help with workouts, nutrition (Egyptian focus), and motivation. ${profileContext}\nRespond in ${getAIResponseLanguageName()}.`;

      const chatHistory = messages
        .filter((m) => m.content !== getInitialMessage())
        .map((m) => ({
          role: m.role === 'coach' ? 'assistant' : 'user',
          content: m.content,
        }));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory,
            userMessage,
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.7,
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const coachResponse = { 
        role: 'coach', 
        content: data.choices[0]?.message?.content || t('coachLostThought') 
      };

      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, coachResponse] } : c));
    } catch (error) {
      console.error(error);
      const errorMsg = { role: 'coach', content: `${t('coachErrorPrefix')} API Error` };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, errorMsg] } : c));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      {/* Mini-Header for Chat Management */}
      <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <button 
          onClick={() => setShowHistory(true)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <History className="w-5 h-5" />
        </button>
        
        <div className="flex-1 px-4 truncate text-center">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">
            {currentChat?.title || t('untitledChat')}
          </span>
        </div>

        <button 
          onClick={createNewChat}
          className="p-2 text-orange-500 hover:text-orange-400 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Chat History Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: isRTL ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 300 : -300 }}
              className={`absolute top-0 bottom-0 w-72 bg-zinc-900 z-50 shadow-2xl safe-area-bottom flex flex-col ${isRTL ? 'right-0' : 'left-0'}`}
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-black/20">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">{t('chatHistory')}</h3>
                <button onClick={() => setShowHistory(false)} className="p-1 text-zinc-500"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <button 
                  onClick={createNewChat}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-zinc-700 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 transition-all mb-4"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">{t('newChat')}</span>
                </button>

                {chats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => { setActiveChatId(chat.id); setShowHistory(false); }}
                    className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeChatId === chat.id ? 'bg-orange-500/10 border border-orange-500/30' : 'hover:bg-zinc-800/50 border border-transparent'}`}
                  >
                    <MessageSquare className={`w-4 h-4 shrink-0 ${activeChatId === chat.id ? 'text-orange-500' : 'text-zinc-600'}`} />
                    <span className={`text-xs font-medium truncate flex-1 ${activeChatId === chat.id ? 'text-orange-500' : 'text-zinc-400'}`}>
                      {chat.title}
                    </span>
                    <button 
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {chats.length === 0 && (
                  <p className="text-center text-zinc-600 text-xs py-10 italic">{t('noChatsYet')}</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'coach' ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-zinc-800'}`}>
                {msg.role === 'coach' ? (
                  <Bot className="w-5 h-5 text-black" />
                ) : (
                  <User className="w-5 h-5 text-zinc-400" />
                )}
              </div>

              <div className={`max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? (isRTL ? 'items-start' : 'items-end') : (isRTL ? 'items-end' : 'items-start')}`}>
                <div className={`rounded-3xl px-5 py-4 shadow-xl ${msg.role === 'coach' ? 'bg-zinc-900/95 border border-zinc-700/50' : 'bg-gradient-to-br from-orange-400 to-orange-500 text-black font-bold'}`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    className={`text-[15px] sm:text-base leading-8 tracking-wide ${msg.role === 'coach' ? 'text-zinc-100' : 'text-black'} prose prose-invert max-w-none`}
                    components={{
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6 rounded-2xl border border-zinc-700/50 bg-black/40">
                          <table className="w-full border-collapse text-sm" {...props} />
                        </div>
                      ),
                      thead: ({ node, ...props }) => <thead className="bg-zinc-800/50" {...props} />,
                      th: ({ node, ...props }) => <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-[10px] text-orange-500 border-b border-zinc-700/50" {...props} />,
                      td: ({ node, ...props }) => <td className="px-4 py-3 text-zinc-300 border-b border-zinc-800/30 font-medium" {...props} />,
                      strong: ({ node, ...props }) => <strong className={`font-black ${msg.role === 'coach' ? 'text-white' : 'text-black'}`} {...props} />,
                      p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-2 marker:text-orange-500" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-xl font-black mb-4 mt-6 text-white" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 mt-5 text-white" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-3 mt-4 text-orange-400" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {msg.role === 'coach' && (
                  <button
                    onClick={() => speakText(msg.content, index)}
                    className={`mt-2 flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors ${isRTL ? 'flex-row-reverse mr-1' : 'ml-1'}`}
                  >
                    {speaking === index ? (
                      <><VolumeX className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase">{t('stop')}</span></>
                    ) : (
                      <><Volume2 className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase">{t('listen')}</span></>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
        <div className="h-10" />
      </div>

      <FooterCredit />

      {/* Input Area */}
      <div 
        className="p-4 border-t border-zinc-800/50 bg-black/40 backdrop-blur-xl z-10" 
        style={{ paddingBottom: `max(env(safe-area-inset-bottom), ${keyboardOffset}px)` }}
      >
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t('askCoachAnything')}
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all shadow-inner ${isRTL ? 'text-right' : ''}`}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || !activeChatId}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-95 transition-transform disabled:opacity-50"
          >
            <Send className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}


