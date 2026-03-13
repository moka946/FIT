import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Ruler, 
  Weight, 
  Sparkles, 
  Loader2, 
  ClipboardList, 
  RotateCcw, 
  Trash2, 
  Dumbbell, 
  Apple, 
  CheckCircle2,
  Info
} from 'lucide-react';
import BottomNav from '@/components/navigation/BottomNav';
import FooterCredit from '@/components/FooterCredit';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { useExerciseDays } from '@/lib/useExerciseDays';
import ReactMarkdown from 'react-markdown';

export default function More() {
  const { t, isRTL, getAIResponseLanguageName } = useLanguage();
  const { user } = useAuth();
  const { exerciseDays } = useExerciseDays();

  const formKey = user ? `plan_form_${user.uid}` : 'plan_form_guest';
  const planKey = user ? `plan_saved_${user.uid}` : 'plan_saved_guest';

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(formKey);
    return saved ? JSON.parse(saved) : { age: '', height: '', weight: '' };
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(() => {
    return localStorage.getItem(planKey) || null;
  });

  useEffect(() => {
    localStorage.setItem(formKey, JSON.stringify(formData));
  }, [formData, formKey]);

  useEffect(() => {
    if (plan) {
      localStorage.setItem(planKey, plan);
    } else {
      localStorage.removeItem(planKey);
    }
  }, [plan, planKey]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearPlan = () => {
    if (window.confirm(t('clearCurrentPlanConfirm'))) {
      setPlan(null);
    }
  };

  const generatePlan = async () => {
    if (!formData.age || !formData.height || !formData.weight) return;

    setLoading(true);
    setPlan(null);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY') {
      alert(t('missingGroqApiKey'));
      setLoading(false);
      return;
    }

    try {
      const prompt = `Create a complete personalized workout and nutrition plan for an Egyptian fitness enthusiast with these stats:
- Age: ${formData.age}
- Height: ${formData.height} cm
- Weight: ${formData.weight} kg

The user only exercises on these specific days: ${exerciseDays?.length > 0 ? exerciseDays.join(', ') : 'every day'}.
The plan MUST include exactly two main sections with these EXACT headers:
# Workout Plan
# Nutrition Plan

Inside Workout Plan, create a schedule ONLY for the specified exercise days (${exerciseDays?.length > 0 ? exerciseDays.join(', ') : 'every day'}).
Inside Nutrition Plan, include specific Egyptian meals (Foul, Ta'ameya, Grilled Chicken, etc.) with calorie estimates.

Please respond in ${getAIResponseLanguageName()}. Format beautifully using markdown.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.1-8b-instant',
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0]?.message?.content || '';
      setPlan(responseText);
    } catch (error) {
      console.error('Plan Generation Error:', error);
      const errorMsg = error?.message || String(error);
      
      if (errorMsg.includes('401')) {
        alert("Invalid API Key. Please check your GitHub Secrets.");
      } else if (errorMsg.includes('429')) {
        alert("Rate limit reached. Try again in a minute.");
      } else {
        alert(`${t('failedGeneratePlan')}: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Premium Gradient Header */}
      <div className="sticky top-0 bg-black/60 backdrop-blur-2xl z-40 border-b border-white/5 px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 to-red-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500" />
            <div className="relative w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">{t('more')}</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[3px]">{t('getYourPlan')}</p>
          </div>
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Section - Redesigned as a Slim Interactive Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/40 border border-zinc-800/60 rounded-[2.5rem] p-6 shadow-xl"
        >
          <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
             <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
             <h2 className="text-lg font-black uppercase tracking-tight text-zinc-100">{t('championStats')}</h2>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { name: 'age', icon: User, placeholder: 'age', unit: '' },
              { name: 'height', icon: Ruler, placeholder: 'height', unit: 'cm' },
              { name: 'weight', icon: Weight, placeholder: 'weight', unit: 'kg' },
            ].map((field) => (
              <div key={field.name} className="relative">
                <div className={`flex flex-col items-center gap-2 p-3 bg-zinc-800/20 border border-zinc-700/30 rounded-2xl focus-within:border-orange-500/50 focus-within:bg-zinc-800/40 transition-all`}>
                  <field.icon className="w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    name={field.name}
                    placeholder="..."
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="bg-transparent w-full text-center outline-none text-white text-lg font-black placeholder:text-zinc-800"
                  />
                  <span className="text-[10px] font-bold uppercase text-zinc-600 tracking-wider">
                    {t(field.placeholder)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={generatePlan}
            disabled={loading || !formData.age || !formData.height || !formData.weight}
            className="group relative w-full h-14 overflow-hidden rounded-2xl bg-orange-500 text-black font-black text-sm uppercase tracking-widest disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t('generating')}</>
              ) : (
                <><Sparkles className="w-5 h-5" /> {t('generatePlan')}</>
              )}
            </div>
          </button>
        </motion.div>

        {/* Plan Section - Themed Cards for Sections */}
        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className={`flex items-center justify-between px-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <ClipboardList className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-black uppercase tracking-tight italic">{t('yourCustomPlan')}</h3>
                </div>
                <button
                  onClick={clearPlan}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Styled Plan Container */}
              <div className={`prose prose-invert max-w-none ${isRTL ? 'text-right' : ''}`}>
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => {
                      const isWorkout = props.children.toString().toLowerCase().includes('workout');
                      const isNutrition = props.children.toString().toLowerCase().includes('nutrition');
                      return (
                        <div className={`relative mt-12 mb-6 group ${isRTL ? 'text-right' : 'text-left'}`}>
                          <div className={`absolute -left-4 -right-4 top-0 bottom-0 bg-gradient-to-r ${isWorkout ? 'from-orange-500/10 to-transparent' : isNutrition ? 'from-emerald-500/10 to-transparent' : 'from-zinc-500/10 to-transparent'} rounded-2xl -z-10`} />
                          <div className={`flex items-center gap-3 mb-2 px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isWorkout ? 'bg-orange-500/20 text-orange-500' : isNutrition ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
                              {isWorkout ? <Dumbbell className="w-5 h-5" /> : isNutrition ? <Apple className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                            </div>
                            <h1 className="text-2xl font-black text-white m-0 uppercase italic tracking-tight" {...props} />
                          </div>
                        </div>
                      );
                    },
                    h2: ({ node, ...props }) => <h2 className="text-lg font-black text-zinc-100 mt-8 mb-4 border-b border-zinc-800 pb-2 uppercase tracking-wide" {...props} />,
                    p: ({ node, ...props }) => <p className="text-zinc-400 leading-relaxed text-sm mb-4" {...props} />,
                    li: ({ node, ...props }) => (
                      <li className="list-none relative pl-6 mb-3 flex items-start group">
                        <CheckCircle2 className="w-4 h-4 text-orange-500/50 absolute left-0 top-1 shrink-0 group-hover:text-orange-500 transition-colors" />
                        <span className="text-zinc-300 text-sm">{props.children}</span>
                      </li>
                    ),
                    strong: ({ node, ...props }) => <strong className="text-white font-black uppercase tracking-tight text-xs bg-zinc-800 px-1.5 py-0.5 rounded ml-1 mr-1" {...props} />,
                  }}
                >
                  {plan}
                </ReactMarkdown>
              </div>

              {/* Action Footer */}
              <div className="flex justify-center pt-10">
                <button
                  onClick={generatePlan}
                  className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold hover:text-orange-500 hover:border-orange-500/30 transition-all py-3 px-8 rounded-2xl active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-widest font-black">{t('updatePlan')}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Hint */}
        {!plan && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 pt-10"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-900/50 border border-dashed border-zinc-800 flex items-center justify-center mx-auto">
              <ClipboardList className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-zinc-500 text-sm font-medium italic">{t('noProgressYet')}</p>
          </motion.div>
        )}
      </div>

      <FooterCredit />
      <BottomNav currentPage="More" />
    </div>
  );
}


