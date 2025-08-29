import React, { useState } from 'react';
import { motion as motionTyped } from 'framer-motion';
import { MailIcon, PhoneIcon, MapPinIcon, Loader2Icon } from '../components/icons';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -50 },
};

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { submitContactForm } = useData();
    const toast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Client-side validation
        if (!formData.name.trim()) {
            toast.error("Name is required");
            return;
        }
        
        if (!formData.email.trim()) {
            toast.error("Email is required");
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        
        if (!formData.message.trim()) {
            toast.error("Message is required");
            return;
        }
        
        if (formData.message.trim().length < 10) {
            toast.error("Message must be at least 10 characters long");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const success = await submitContactForm({
                name: formData.name.trim(),
                email: formData.email.trim(),
                message: formData.message.trim(),
            });
            
            if (success) {
                setFormData({ name: '', email: '', message: '' });
                toast.success("Thank you! Your message has been sent.");
            } else {
                toast.error("Failed to send message. Please try again.");
            }
        } catch (error: any) {
            console.error('Contact form error:', error);
            const errorMessage = error?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold font-serif text-gray-900 dark:text-white">Contact Us</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-zinc-400">
          Have a question or want to work with us? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-zinc-800 p-8 sm:p-12 rounded-2xl shadow-lg">
        {/* Contact Info */}
        <div className="space-y-8">
            <h2 className="text-3xl font-bold font-serif">Get in Touch</h2>
            <p className="text-gray-500 dark:text-zinc-400">
                We're here to help and answer any question you might have. We look forward to hearing from you.
            </p>
            <div className="space-y-4">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                        <MapPinIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Our Office</h3>
                        <p className="text-gray-500 dark:text-zinc-400">123 OwnWrites Lane, Storyville, USA 12345</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                        <MailIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Email Us</h3>
                        <p className="text-gray-500 dark:text-zinc-400">hello@ownwrites.com</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                        <PhoneIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Call Us</h3>
                        <p className="text-gray-500 dark:text-zinc-400">(123) 456-7890</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input type="text" name="name" id="name" required placeholder="Your Name" value={formData.name} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-100 dark:bg-zinc-700 sm:text-sm p-3" />
            </div>
             <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" name="email" id="email" required placeholder="Your Email" value={formData.email} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-100 dark:bg-zinc-700 sm:text-sm p-3" />
            </div>
             <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea name="message" id="message" rows={5} required placeholder="Your Message" value={formData.message} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-zinc-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-100 dark:bg-zinc-700 sm:text-sm p-3"></textarea>
            </div>
            <div>
                <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:bg-slate-400">
                    {isSubmitting ? <Loader2Icon className="w-5 h-5 animate-spin" /> : 'Send Message'}
                </button>
            </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactPage;