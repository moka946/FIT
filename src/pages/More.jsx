import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Ruler, Weight, Sparkles, Loader2, ClipboardList, Utensils } from 'lucide-react';
import BottomNav from '@/components/navigation/BottomNav';
import { useLanguage } from '@/components/LanguageContext';
import { Groq } from "groq-sdk";
import ReactMarkdown from 'react-markdown';

export default function More() {
    const { t, isRTL, language } = useLanguage();
    const [formData, setFormData] = useState({
        age: '',
        height: '',
        weight: ''
    });
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generatePlan = async () => {
        if (!formData.age || !formData.height || !formData.weight) return;

        setLoading(true);
        setPlan(null);

        const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
        if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY') {
            alert("Please add your Groq API key to the .env file!");
            setLoading(false);
            return;
        }

        try {
            const groq = new Groq({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true
            });

            const prompt = `Create a complete personalized workout and nutrition plan for an Egyptian fitness enthusiast with these stats:
- Age: ${formData.age}
- Height: ${formData.height} cm
- Weight: ${formData.weight} kg

The plan should include:
1. A weekly workout schedule focused on these stats.
2. A daily nutrition plan including Egyptian meals (like Foul, Ta'ameya, Grilled Chicken, etc.) with estimated calories.

Please respond in ${language === 'ar' ? 'Arabic' : 'English'} and format with clear headers for "Workout Plan" and "Nutrition Plan".`;

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "user", content: prompt }
                ],
                model: "llama-3.3-70b-versatile",
            });

            const responseText = completion.choices[0]?.message?.content || "";
            setPlan(responseText);
        } catch (error) {
            console.error("Plan Generation Error:", error);
            if (String(error).includes('fetch')) {
                alert("Failed to connect to AI. Please disable any adblockers or check your internet connection.");
            } else {
                alert("Failed to generate plan. Please check your API key or connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pb-24 text-white">
            {/* Header */}
            <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-40 border-b border-zinc-800 p-6">
                <h1 className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>{t('more')}</h1>
                <p className={`text-zinc-500 text-sm ${isRTL ? 'text-right' : ''}`}>{t('getYourPlan')}</p>
            </div>

            <div className="p-6 max-w-md mx-auto space-y-8">
                {/* Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
                    <div className="space-y-4">
                        <div className={`flex items-center gap-3 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <User className="w-5 h-5 text-orange-500" />
                            <input
                                type="number"
                                name="age"
                                placeholder={t('age')}
                                value={formData.age}
                                onChange={handleInputChange}
                                className={`bg-transparent w-full outline-none text-white placeholder:text-zinc-600 ${isRTL ? 'text-right' : ''}`}
                            />
                        </div>

                        <div className={`flex items-center gap-3 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Ruler className="w-5 h-5 text-orange-500" />
                            <input
                                type="number"
                                name="height"
                                placeholder={t('height')}
                                value={formData.height}
                                onChange={handleInputChange}
                                className={`bg-transparent w-full outline-none text-white placeholder:text-zinc-600 ${isRTL ? 'text-right' : ''}`}
                            />
                        </div>

                        <div className={`flex items-center gap-3 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Weight className="w-5 h-5 text-orange-500" />
                            <input
                                type="number"
                                name="weight"
                                placeholder={t('weight')}
                                value={formData.weight}
                                onChange={handleInputChange}
                                className={`bg-transparent w-full outline-none text-white placeholder:text-zinc-600 ${isRTL ? 'text-right' : ''}`}
                            />
                        </div>
                    </div>

                    <button
                        onClick={generatePlan}
                        disabled={loading || !formData.age || !formData.height || !formData.weight}
                        className="w-full h-14 rounded-2xl bg-orange-500 text-black font-bold flex items-center justify-center gap-2 hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {t('generating')}
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                {t('generatePlan')}
                            </>
                        )}
                    </button>
                </div>

                {/* Plan Display */}
                <AnimatePresence>
                    {plan && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
                        >
                            <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <ClipboardList className="w-6 h-6 text-orange-500" />
                                <h2 className="text-xl font-bold">{t('yourCustomPlan')}</h2>
                            </div>

                            <div className="prose prose-invert prose-orange max-w-none">
                                <ReactMarkdown>{plan}</ReactMarkdown>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <BottomNav currentPage="More" />
        </div>
    );
}
