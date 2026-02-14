import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, Loader2, Bot, User } from 'lucide-react';
import { Groq } from "groq-sdk";
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import FooterCredit from '@/components/FooterCredit';
import { useLanguage } from '@/components/LanguageContext';

export default function CoachChat() {
  const { t, isRTL, language } = useLanguage();

  const getInitialMessage = () => language === 'ar'
    ? "أهلاً يا بطل! 💪 أنا المدرب، مساعدك الشخصي للياقة البدنية. اسألني أي شيء عن التمارين أو التغذية أو رحلتك الرياضية. يلا نحقق أهدافك!"
    : "Hey champ! 💪 I'm Coach, your personal fitness AI. Ask me anything about workouts, nutrition, or your fitness journey. Let's crush those goals together!";

  const [messages, setMessages] = useState([
    {
      role: 'coach',
      content: getInitialMessage()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (text, index) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      if (speaking === index) {
        setSpeaking(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => setSpeaking(null);
      utterance.onerror = () => setSpeaking(null);

      window.speechSynthesis.speak(utterance);
      setSpeaking(index);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY') {
      setMessages(prev => [...prev, {
        role: 'coach',
        content: "Champ, I don't have your Groq API key yet! Please add it to the `.env` file as `VITE_GROQ_API_KEY`."
      }]);
      setLoading(false);
      return;
    }

    try {
      const systemPrompt = `You are Coach, an energetic and motivating gym personal trainer AI. You help with:
- Workout plans and exercise tips
- Nutrition advice (especially Egyptian cuisine)
- Motivation and fitness goals
- Form correction and injury prevention

Be enthusiastic, supportive, and use fitness terminology. Keep responses concise but helpful. Respond in ${language === 'ar' ? 'Arabic' : 'English'}.`;

      const groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });

      const chatHistory = messages
        .filter(m => m.content !== getInitialMessage())
        .map(m => ({
          role: (m.role === 'coach' ? 'assistant' : 'user'),
          content: m.content,
        }));

      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          { role: "user", content: currentInput }
        ],
        model: "llama-3.3-70b-versatile",
      });

      const responseText = completion.choices[0]?.message?.content || "Sorry champ, I lost my train of thought.";

      setMessages(prev => [...prev, { role: 'coach', content: responseText }]);
    } catch (error) {
      console.error("Groq AI Error:", error);
      const errorStr = String(error);
      let errorMessage = `Sorry champ, I had trouble connecting to my brain: ${errorStr.substring(0, 150)}`;

      if (errorStr.includes('401')) {
        errorMessage = "Your Groq API key seems invalid, champ! Check it in the `.env` file.";
      } else if (errorStr.includes('429')) {
        errorMessage = "I'm hitting a rate limit! Let's take a quick breather and try again.";
      } else if (errorStr.includes('fetch')) {
        errorMessage = "I had trouble connecting! Please check your internet or disable any adblockers.";
      }

      setMessages(prev => [...prev, {
        role: 'coach',
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} ${isRTL && msg.role === 'coach' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'coach' ? 'bg-orange-500' : 'bg-zinc-800'
                }`}>
                {msg.role === 'coach' ? (
                  <Bot className="w-5 h-5 text-black" />
                ) : (
                  <User className="w-5 h-5 text-zinc-400" />
                )}
              </div>

              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-3 ${msg.role === 'coach'
                  ? 'bg-zinc-900 border border-zinc-800'
                  : 'bg-orange-500 text-black'
                  }`}>
                  <ReactMarkdown className={`text-sm ${msg.role === 'coach' ? 'text-white' : 'text-black'} prose prose-sm prose-invert max-w-none`}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {msg.role === 'coach' && (
                  <button
                    onClick={() => speakText(msg.content, index)}
                    className={`mt-2 flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {speaking === index ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span className="text-xs">{t('stop')}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span className="text-xs">{t('listen')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

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
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                <span className="text-zinc-400 text-sm">{t('coachThinking')}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
        <FooterCredit />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t('askCoachAnything')}
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors ${isRTL ? 'text-right' : ''}`}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}