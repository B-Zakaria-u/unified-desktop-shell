import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';

const Login = ({ onLoginSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            onLoginSuccess(result.user);
        } catch (err) {
            console.error(err);
            setError('Failed to sign in with Google. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userCredential;
            if (isSignUp) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }
            onLoginSuccess(userCredential.user);
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full bg-[#111214] text-white items-center justify-center overflow-hidden">

            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-sm p-8 bg-[#1E1F22]/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl flex flex-col items-center ring-1 ring-white/10">

                {/* Logo & Header */}
                <div className="mb-6 flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#2B2D31] rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10 mb-4">
                        <Sparkles size={24} className="text-[#5865F2]" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg mb-4 text-xs font-medium text-center animate-shake">
                        {error}
                    </div>
                )}

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-3 mb-4">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#111214]/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 transition-all"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#111214]/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 transition-all"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5865F2]/20"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                {/* Divider */}
                <div className="w-full flex items-center gap-3 mb-4">
                    <div className="h-[1px] flex-1 bg-white/10"></div>
                    <span className="text-xs text-gray-500 font-medium">OR</span>
                    <div className="h-[1px] flex-1 bg-white/10"></div>
                </div>

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="group relative w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/20 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-none overflow-hidden"
                >
                    <div className="flex items-center justify-center gap-3 relative z-10">
                        <svg width="20" height="20" className="w-5 h-5 filter drop-shadow-sm" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="text-gray-900 group-hover:text-gray-700 transition-colors">Sign in with Google</span>
                    </div>
                </button>

                {/* Toggle Mode */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-[#5865F2] hover:text-[#4752C4] font-bold hover:underline transition-all"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <div className="absolute bottom-4 text-center">
                    <p className="text-[10px] text-gray-700 font-medium tracking-wide">
                        UNIFIED DESKTOP SHELL
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
