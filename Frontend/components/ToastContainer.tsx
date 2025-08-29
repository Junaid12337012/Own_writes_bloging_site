import React, { useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ToastMessagesContext } from '../contexts/ToastContext';
import Toast from './admin/Toast';

const ToastContainer: React.FC = () => {
    const toasts = useContext(ToastMessagesContext);
    return (
        <div className="fixed top-20 right-4 z-[101] w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;