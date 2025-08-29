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

const AdminMessagesPage: React.FC = () => {
    const { contactMessages, deleteContactMessage, loading, refreshContactMessages } = useData();
    const toast = useToast();
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    // Refresh contact messages on component mount
    React.useEffect(() => {
        refreshContactMessages();
    }, []); // Empty dependency array to run only once

    const handleDeleteClick = (id: string, name: string) => {
        setDeleteTarget({ id, name });
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            deleteContactMessage(deleteTarget.id);
            toast.success(`Message from "${deleteTarget.name}" deleted.`);
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Contact Form Messages</h1>
            
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
                {loading.contactMessages ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Loading messages...</p>
                    </div>
                ) : contactMessages.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-slate-600 dark:text-slate-400">No messages found.</p>
                        <button 
                            onClick={refreshContactMessages}
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
                                    <th scope="col" className="px-6 py-3">Author</th>
                                    <th scope="col" className="px-6 py-3">Message</th>
                                    <th scope="col" className="px-6 py-3">Submitted On</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contactMessages.map(message => (
                                    <tr key={message.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{message.name}</div>
                                            <a href={`mailto:${message.email}`} className="text-slate-500 hover:underline">{message.email}</a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="max-w-md whitespace-pre-wrap">{message.message}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(message.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDeleteClick(message.id, message.name)} className="font-medium text-red-600 dark:text-red-500 hover:underline p-1">
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
                title="Delete Message"
                message={`Are you sure you want to permanently delete the message from "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </motion.div>
    );
};

export default AdminMessagesPage;