import React, { useState } from 'react';
import { motion as motionTyped } from 'framer-motion';
import { MailIcon, Loader2Icon } from './icons';
import { useToast } from '../hooks/useToast';
import { useData } from '../hooks/useData';

const motion = motionTyped as any;

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { subscribe } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(async () => {
      const success = await subscribe(email);
      setIsLoading(false);
      if (success) {
        toast.success("Thanks for subscribing! You're on the list.");
      } else {
        toast.info("You are already subscribed!");
      }
      setEmail('');
    }, 1000);
  };

  return (
    <motion.section 
        className="relative py-16 px-6 sm:py-24 lg:px-8 rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
    >
        <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
      <div className="relative max-w-xl mx-auto text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-500/10 border-2 border-primary-500/20">
            <MailIcon className="h-8 w-8 text-primary-400" />
        </div>
        <h2 className="mt-6 text-3xl font-bold font-serif tracking-tight text-white sm:text-4xl">
          Subscribe to our newsletter
        </h2>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          Get the latest articles, tutorials, and news delivered straight to your inbox. No spam, ever.
        </p>
        <form onSubmit={handleSubmit} className="mt-10 sm:flex sm:items-center sm:justify-center sm:gap-x-3">
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            name="email-address"
            id="email-address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:max-w-xs rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 w-full sm:w-auto flex-none rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-colors disabled:bg-primary-400/50 disabled:cursor-not-allowed flex justify-center items-center min-w-[100px]"
          >
            {isLoading ? (
                <Loader2Icon className="w-5 h-5 animate-spin" />
            ) : (
                'Notify me'
            )}
          </button>
        </form>
      </div>
    </motion.section>
  );
};

export default NewsletterSignup;