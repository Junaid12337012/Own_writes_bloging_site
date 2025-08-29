import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2Icon, MailIcon } from '../components/icons';
import { useToast } from '../hooks/useToast';
import { useData } from '../hooks/useData';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const CODE_LENGTH = 6;

const VerifyEmailPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
    const { verifyEmail, unverifiedUserEmail } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { siteSettings } = useData();
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const [countdown, setCountdown] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    useEffect(() => {
        if (!unverifiedUserEmail) {
            navigate('/login');
            return;
        }
        
        // Focus first input and show toast only on initial mount
        inputsRef.current[0]?.focus();
        toast.info("A code has been sent to your email. For this demo, use: 324534");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        if (!isResendDisabled) return;
        if (countdown === 0) {
            setIsResendDisabled(false);
            return;
        }

        const timerId = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [countdown, isResendDisabled]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Only take the last digit
        setCode(newCode);

        if (value && index < CODE_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(paste)) {
            const newCode = paste.split('');
            setCode(newCode);
            inputsRef.current[CODE_LENGTH - 1]?.focus();
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        e.currentTarget.focus();
        e.currentTarget.select();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join('');
        if (verificationCode.length !== CODE_LENGTH) {
            toast.error(`Please enter the full ${CODE_LENGTH}-digit code.`);
            return;
        }

        setIsLoading(true);
        try {
            await verifyEmail(verificationCode);
            toast.success(`Verification successful! Welcome to ${siteSettings.title}.`);
            navigate('/');
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };
    
    const handleResendCode = () => {
        if (isResendDisabled) return;
        toast.info("A new code has been sent. (Hint: it's still 324534)");
        setCountdown(30);
        setIsResendDisabled(true);
    };
    
    if (!unverifiedUserEmail) {
        return null;
    }

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
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/50">
                    <MailIcon className="h-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h1 className="mt-5 text-3xl font-bold font-serif text-gray-900 dark:text-white">
                    Check your email
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                    We've sent a 6-digit verification code to <br/>
                    <span className="font-semibold text-gray-700 dark:text-zinc-200">{unverifiedUserEmail}</span>.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex justify-center gap-2">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { inputsRef.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            onClick={handleClick}
                            className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-950 focus:border-primary-500 focus:ring-primary-500"
                        />
                    ))}
                </div>
                <div className="mt-8">
                     <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400">
                        {isLoading ? <Loader2Icon className="animate-spin w-5 h-5"/> : 'Verify Account'}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-500 dark:text-zinc-400">Didn't receive the code? </span>
                <button 
                    onClick={handleResendCode}
                    disabled={isResendDisabled}
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 disabled:text-gray-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed"
                >
                    Resend Code
                </button>
                {isResendDisabled && <span className="text-gray-400 dark:text-zinc-500 ml-1">({countdown}s)</span>}
            </div>
          </div>
        </motion.div>
    );
};

export default VerifyEmailPage;