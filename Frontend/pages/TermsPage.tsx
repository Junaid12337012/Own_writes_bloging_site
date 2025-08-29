import React from 'react';
import { motion as motionTyped } from 'framer-motion';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const TermsPage: React.FC = () => {
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
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">Terms & Conditions</h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Effective date: July 1, 2024</p>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
        <p>Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the OwnWrites website (the "Service") operated by OwnWrites, Inc. ("us", "we", or "our").</p>
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>
        
        <h2>1. Accounts</h2>
        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
        
        <h2>2. Intellectual Property</h2>
        <p>The Service and its original content, features and functionality are and will remain the exclusive property of OwnWrites, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
        
        <h2>3. Links To Other Web Sites</h2>
        <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by OwnWrites, Inc.</p>
        <p>OwnWrites, Inc. has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that OwnWrites, Inc. shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
        
        <h2>4. Changes</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
      </div>
    </motion.div>
  );
};

export default TermsPage;