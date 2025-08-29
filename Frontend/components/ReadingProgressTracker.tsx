import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ReadingProgressTrackerProps {
  targetRef: React.RefObject<HTMLElement>;
}

const ReadingProgressTracker: React.FC<ReadingProgressTrackerProps> = ({ targetRef }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      if (!targetRef.current) return;

      const element = targetRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = element.offsetHeight;
      
      // Calculate how much of the element has been scrolled past
      const scrolled = Math.max(0, windowHeight - rect.top);
      const total = elementHeight + windowHeight;
      const progressPercentage = Math.min(100, (scrolled / total) * 100);
      
      setProgress(progressPercentage);
      setIsVisible(progressPercentage > 5 && progressPercentage < 95);
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetRef]);

  return (
    <>
      {/* Fixed Progress Bar at Top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 z-50 origin-left"
        style={{ scaleX: progress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Floating Progress Circle - Hidden on mobile */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="hidden sm:block fixed bottom-8 right-8 z-40"
        >
          <div className="relative w-16 h-16">
            {/* Background Circle */}
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Progress Circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-primary-500"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
              />
            </svg>
            {/* Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ReadingProgressTracker;
