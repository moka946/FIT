import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Chrome, Mail, Lock, ArrowRight, Loader2, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
    const { login, loginWithEmail, signUpWithEmail } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await login();
        } catch (error) {
            toast.error('Google login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            if (isSignUp) {
                await signUpWithEmail(email, password);
                toast.success('Account created successfully!');
            } else {
                await loginWithEmail(email, password);
                toast.success('Welcome back!');
            }
        } catch (error) {
            const message = error.code === 'auth/email-already-in-use'
                ? 'This email is already registered.'
                : error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
                    ? 'Invalid email or password.'
                    : 'Authentication failed. Please check your credentials.';
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
                    <p className="text-zinc-500 font-medium">Your Elite AI Fitness Coach</p>
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
                                {isSignUp ? 'Join the Team' : 'Welcome, Champion'}
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
                                            {isSignUp ? 'Sign up' : 'Continue'} with Google
                                        </>
                                    )}
                                </button>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-zinc-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-zinc-900 px-2 text-zinc-500">Or use email</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email address"
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
                                            placeholder="Password"
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
                                            {isSignUp ? 'Create Account' : 'Start Training'}
                                            {isSignUp ? <UserPlus className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    <p className="text-center text-zinc-500 text-sm mt-8">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-orange-500 font-bold cursor-pointer hover:underline focus:outline-none"
                        >
                            {isSignUp ? 'Sign in' : 'Join the team'}
                        </button>
                    </p>
                </div>

                {/* Footer Info */}
                <p className="text-center text-zinc-600 text-[10px] mt-12 uppercase tracking-widest font-medium">
                    Powered by Firebase • Claude AI
                </p>
            </motion.div>
        </div>
    );
}
