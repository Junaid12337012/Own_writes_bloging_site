import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangleIcon, InfoIcon } from '../icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const modalTypes = {
  danger: {
    icon: <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />,
    confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    iconBgClass: 'bg-red-100 dark:bg-red-900/50',
  },
  warning: {
    icon: <AlertTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />,
    confirmButtonClass: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    iconBgClass: 'bg-yellow-100 dark:bg-yellow-900/50',
  },
  info: {
    icon: <InfoIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/50',
  },
};


const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}) => {
  const modalStyle = modalTypes[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${modalStyle.iconBgClass} sm:mx-0 sm:h-10 sm:w-10`}>
                  {modalStyle.icon}
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white" id="modal-title">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <footer className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-full border border-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium text-white rounded-full ${modalStyle.confirmButtonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
