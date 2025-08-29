import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from './icons';
import AIAssistantModal from './AIAssistantModal';

const AIAssistantFab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open AI Assistant"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          >
            <SparklesIcon className="w-8 h-8" />
          </motion.div>
        </motion.button>
      </div>
      <AIAssistantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AIAssistantFab;
