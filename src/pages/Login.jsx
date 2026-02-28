import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Chrome, Mail, Lock, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FooterCredit from '@/components/FooterCredit';
import { useLanguage } from '@/components/LanguageContext';

export default function Login() {
    const { login, loginWithEmail, signUpWithEmail } = useAuth();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await login();
        } catch (error) {
            toast.error(t('googleLoginFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error(t('pleaseFillAllFields'));
            return;
        }

        setIsLoading(true);
        try {
            if (isSignUp) {
                await signUpWithEmail(email, password);
                toast.success(t('accountCreatedExercisePrompt'));
            } else {
                await loginWithEmail(email, password);
                toast.success(t('welcomeBackToast'));
            }
        } catch (error) {
            const message = error.code === 'auth/email-already-in-use'
                ? t('emailAlreadyRegistered')
                : error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
                    ? t('invalidCredentials')
                    : t('authFailed');
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                    >
                        <Dumbbell className="w-10 h-10 text-black" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">FIT EGYPT</h1>
                    <p className="text-zinc-500 font-medium">{t('appTagline')}</p>
                </div>

                {/* Action Card */}
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isSignUp ? 'signup' : 'login'}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-8 text-center">
                                {isSignUp ? t('joinTeamTitle') : t('welcomeChampionTitle')}
                            </h2>

                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="w-full h-14 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Chrome className="w-5 h-5" />
                                            {isSignUp ? t('signUp') : t('continue')} {t('withGoogle')}
                                        </>
                                    )}
                                </button>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-zinc-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-zinc-900 px-2 text-zinc-500">{t('orUseEmail')}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t('emailAddress')}
                                            className="w-full h-14 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t('password')}
                                            className="w-full h-14 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-orange-500 text-black rounded-2xl font-bold flex items-center justify-center gap-2 mt-6 hover:bg-orange-400 transition-all shadow-[0_4px_15px_rgba(249,115,22,0.2)] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-black" />
                                    ) : (
                                        <>
                                            {isSignUp ? t('createAccount') : t('startTraining')}
                                            {isSignUp ? <UserPlus className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    <p className="text-center text-zinc-500 text-sm mt-8">
                        {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}{' '}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-orange-500 font-bold cursor-pointer hover:underline focus:outline-none"
                        >
                            {isSignUp ? t('signIn') : t('joinTheTeam')}
                        </button>
                    </p>
                </div>

                <FooterCredit />
            </motion.div>
        </div>
    );
}
