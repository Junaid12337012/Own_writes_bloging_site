import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, InfoIcon } from '../icons';
import { ToastMessage } from '../../contexts/ToastContext';

interface ToastProps {
  toast: ToastMessage;
}

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  error: <XCircleIcon className="w-6 h-6 text-red-500" />,
  info: <InfoIcon className="w-6 h-6 text-blue-500" />,
};

const Toast: React.FC<ToastProps> = ({ toast }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5, transition: { duration: 0.2 } }}
      className="flex items-start p-4 mb-4 w-full max-w-sm bg-white dark:bg-zinc-800 rounded-lg shadow-xl border dark:border-zinc-700 pointer-events-auto"
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{toast.message}</p>
      </div>
    </motion.div>
  );
};

export default Toast;