import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../hooks/useData';
import { Snippet } from '../../types';
import { useToast } from '../../hooks/useToast';
import * as Icons from '../../components/icons';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const AdminSnippetsPage: React.FC = () => {
  const { snippets, createSnippet, updateSnippet, deleteSnippet } = useData();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'PenSquareIcon',
    content: ''
  });

  const iconOptions = [
    'PenSquareIcon', 'MousePointerClickIcon', 'InfoIcon', 'QuoteIcon', 'GridIcon',
    'Code2Icon', 'MailIcon', 'AlertTriangleIcon', 'CheckCircleIcon', 'ImageIcon',
    'CreditCardIcon', 'StarIcon', 'HeartIcon', 'BookOpenIcon', 'LightbulbIcon'
  ];

  const handleOpenModal = (snippet?: Snippet) => {
    if (snippet) {
      setEditingSnippet(snippet);
      setFormData({
        name: snippet.name,
        description: snippet.description,
        icon: snippet.icon,
        content: snippet.content
      });
    } else {
      setEditingSnippet(null);
      setFormData({
        name: '',
        description: '',
        icon: 'PenSquareIcon',
        content: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSnippet(null);
    setFormData({
      name: '',
      description: '',
      icon: 'PenSquareIcon',
      content: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      let success = false;
      if (editingSnippet) {
        success = await updateSnippet(editingSnippet.id, formData);
        if (success) {
          toast.success('Snippet updated successfully!');
        }
      } else {
        success = await createSnippet(formData);
        if (success) {
          toast.success('Snippet created successfully!');
        }
      }
      
      if (success) {
        handleCloseModal();
      } else {
        toast.error('Failed to save snippet. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while saving the snippet.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      const success = await deleteSnippet(deleteTarget);
      if (success) {
        toast.success('Snippet deleted successfully!');
        setDeleteTarget(null);
      } else {
        toast.error('Failed to delete snippet. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the snippet.');
    }
  };

  const IconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : <Icons.PenSquareIcon className="w-6 h-6" />;
  };

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={{ duration: 0.3 }}
        className="p-6 max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Snippets</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage reusable content blocks for your posts
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Icons.PlusIcon className="w-5 h-5 mr-2" />
            New Snippet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <motion.div
              key={snippet.id}
              layout
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-primary-500 dark:text-primary-400 mr-3">
                    {IconComponent(snippet.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {snippet.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {snippet.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(snippet)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    title="Edit snippet"
                  >
                    <Icons.EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(snippet.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete snippet"
                  >
                    <Icons.Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-md p-3 text-xs text-slate-600 dark:text-slate-400 font-mono overflow-hidden">
                <div 
                  dangerouslySetInnerHTML={{ __html: snippet.content.substring(0, 100) + '...' }}
                  className="line-clamp-3"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {snippets.length === 0 && (
          <div className="text-center py-12">
            <Icons.PenSquareIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No snippets yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Create your first content snippet to get started.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Icons.PlusIcon className="w-5 h-5 mr-2" />
              Create Snippet
            </button>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {editingSnippet ? 'Edit Snippet' : 'Create New Snippet'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Enter snippet name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Brief description of the snippet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>
                        {icon.replace('Icon', '').replace(/([A-Z])/g, ' $1').trim()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    HTML Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white font-mono text-sm"
                    placeholder="Enter HTML content for the snippet"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    {editingSnippet ? 'Update' : 'Create'} Snippet
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Snippet"
        message="Are you sure you want to delete this snippet? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </>
  );
};

export default AdminSnippetsPage;
