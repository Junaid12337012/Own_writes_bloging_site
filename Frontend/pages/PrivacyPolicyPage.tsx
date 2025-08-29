import React from 'react';
import { motion as motionTyped } from 'framer-motion';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const PrivacyPolicyPage: React.FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Last updated: July 1, 2024</p>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
        <p>Welcome to Inkwell. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.</p>
        <p>The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
        <ul>
            <li>Name and Contact Data. We collect your first and last name, email address, postal address, phone number, and other similar contact data.</li>
            <li>Credentials. We collect passwords, password hints, and similar security information used for authentication and account access.</li>
            <li>Payment Data. We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
        
        <h2>3. Will Your Information Be Shared With Anyone?</h2>
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
        
        <h2>4. Cookies and Other Tracking Technologies</h2>
        <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.</p>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicyPage;