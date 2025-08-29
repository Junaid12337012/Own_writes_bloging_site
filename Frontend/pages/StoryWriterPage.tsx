import React from 'react';
import { motion } from 'framer-motion';
import { PenSquareIcon } from '../components/icons';
import StoryWriter from '../components/StoryWriter';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const StoryWriterPage: React.FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="text-center mb-12">
         <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50 mb-4">
            <PenSquareIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white sm:text-5xl">
          AI Story Writer
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-zinc-400">
          Unleash your creativity. Provide a prompt and let our AI weave a unique story for you.
        </p>
      </div>

      <StoryWriter />
      
    </motion.div>
  );
};

export default StoryWriterPage;