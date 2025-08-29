import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../hooks/useData';
import { Link } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

interface SitePageProps {
  slug: string;
}

const SitePage: React.FC<SitePageProps> = ({ slug }) => {
  const { pages } = useData();
  const page = pages.find(p => p.slug === slug);

  if (!page) {
    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold font-serif text-slate-900 dark:text-white">404 - Page Not Found</h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">The page you're looking for doesn't exist.</p>
            <Link to="/" className="mt-6 inline-block text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                Go back home
            </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </motion.div>
  );
};

export default SitePage;