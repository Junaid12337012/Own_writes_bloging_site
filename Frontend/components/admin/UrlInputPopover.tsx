import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XIcon } from '../icons';

interface UrlInputPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialValue?: string;
  type: 'link' | 'image' | 'video';
}

const UrlInputPopover: React.FC<UrlInputPopoverProps> = ({ anchorEl, onClose, onSubmit, initialValue = '', type }) => {
  const [url, setUrl] = useState(initialValue);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUrl(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && anchorEl && !anchorEl.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, anchorEl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    } else {
       onClose();
    }
  };

  if (!anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const popoverStyle = {
    position: 'fixed',
    top: `${rect.bottom + 8}px`,
    left: `${rect.left + rect.width / 2}px`,
  };

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={popoverStyle as React.CSSProperties}
      className="z-50 -translate-x-1/2"
      onMouseDown={(e) => e.stopPropagation()}
      data-popover="true"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600">
        <input
          type="url"
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={`Enter ${type} URL...`}
          className="w-64 px-2 py-1 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button type="submit" className="p-1.5 rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors">
            <CheckIcon className="w-4 h-4" />
        </button>
         <button type="button" onClick={onClose} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors">
            <XIcon className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
};

export default UrlInputPopover;
