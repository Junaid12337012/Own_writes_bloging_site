import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2Icon } from '../../components/icons';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const AdminSubscribersPage: React.FC = () => {
    const { subscribers, deleteSubscriber, loading, refreshSubscribers } = useData();
    const toast = useToast();
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; email: string } | null>(null);

    // Refresh subscribers on component mount
    React.useEffect(() => {
        refreshSubscribers();
    }, []); // Empty dependency array to run only once

    const handleDeleteClick = (id: string, email: string) => {
        setDeleteTarget({ id, email });
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            deleteSubscriber(deleteTarget.id);
            toast.success(`Subscriber "${deleteTarget.email}" deleted.`);
            setDeleteTarget(null);
        }
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Newsletter Subscribers</h1>
            
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
                {loading.subscribers ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Loading subscribers...</p>
                    </div>
                ) : subscribers.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-slate-600 dark:text-slate-400">No subscribers found.</p>
                        <button 
                            onClick={refreshSubscribers}
                            className="mt-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Email Address</th>
                                    <th scope="col" className="px-6 py-3">Subscribed On</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.map(subscriber => (
                                    <tr key={subscriber.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                        <td className="px-6 py-4">
                                            <a href={`mailto:${subscriber.email}`} className="font-medium text-slate-900 dark:text-white hover:underline">{subscriber.email}</a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(subscriber.subscribedAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDeleteClick(subscriber.id, subscriber.email)} className="font-medium text-red-600 dark:text-red-500 hover:underline p-1">
                                                <Trash2Icon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
             <ConfirmationModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Unsubscribe User"
                message={`Are you sure you want to permanently remove "${deleteTarget?.email}" from the subscribers list? This action cannot be undone.`}
                confirmText="Unsubscribe"
                type="danger"
            />
        </motion.div>
    );
};

export default AdminSubscribersPage;