import React, { useState } from 'react';
import { motion as motionTyped } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, Loader2Icon } from '../components/icons';
import { useToast } from '../hooks/useToast';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check password length first
        if (password.length < 6) {
            toast.error("Please enter a password with at least 6 characters.");
            return;
        }
        
        setIsLoading(true);
        
        const result = await login(email, password);
        
        if (result.success) {
            toast.success("Login successful! Welcome back.");
            navigate('/');
        } else {
            toast.error(result.message);
        }
        
        setIsLoading(false);
    };
    
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await loginWithGoogle();
            if (result.success) {
                toast.success(result.message);
                // Navigation will be handled by the auth callback
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error("Google sign-in failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center py-12"
    >
      <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-white">
                Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                Welcome back! Please enter your details.
            </p>
        </div>
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md shadow-sm">
                <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-950 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="Email address"/>
                </div>
                 <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input id="password" name="password" type="password" autoComplete="current-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-950 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="Password (minimum 6 characters)"/>
                    {password.length > 0 && password.length < 6 && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">Password must be at least 6 characters long</p>
                    )}
                </div>
            </div>
            <div>
                 <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400">
                    {isLoading ? <Loader2Icon className="animate-spin w-5 h-5"/> : 'Sign In'}
                </button>
            </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-zinc-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-800 text-gray-500">Or</span>
            </div>
          </div>
          <div className="mt-6">
             <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
            >
                <GoogleIcon className="h-5 w-5 mr-3" />
                Continue with Google
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Don't have an account? </span>
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Sign up
            </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;