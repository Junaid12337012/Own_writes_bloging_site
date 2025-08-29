import React, { useState } from 'react';
import { motion as motionTyped } from 'framer-motion';
import { PlusCircleIcon, EditIcon, Trash2Icon } from '../../components/icons';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const AdminCategoriesPage: React.FC = () => {
  const [newCategory, setNewCategory] = useState({ name: '', description: '', imageUrl: '' });
  const { categories, createCategory, deleteCategory } = useData();
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim() === '') return;
    
    const success = await createCategory(newCategory);
    if (success) {
      toast.success(`Category "${newCategory.name.trim()}" added.`);
      setNewCategory({ name: '', description: '', imageUrl: '' });
    } else {
      toast.error('Failed to add category. Please try again.');
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        const success = await deleteCategory(deleteTarget.id);
        if (success) {
          toast.success(`Category "${deleteTarget.name}" deleted.`);
        } else {
          toast.error(`Failed to delete "${deleteTarget.name}".`);
        }
      } catch (error: any) {
        toast.error(error.message || `Cannot delete "${deleteTarget.name}". It is in use by one or more posts.`);
      }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <th scope="col" className="px-6 py-3 min-w-[200px]">Name</th>
                        <th scope="col" className="px-6 py-3 min-w-[250px]">Description</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                        <td className="px-6 py-4">
                           <div className="flex items-center">
                                <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 rounded-md mr-4 object-cover flex-shrink-0 bg-slate-100 dark:bg-slate-700" />
                                <span className="font-medium text-slate-900 dark:text-white">{cat.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                            <p className="max-w-xs truncate">{cat.description}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-3">
                                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline p-1" disabled>
                                    <EditIcon className="w-5 h-5 opacity-50 cursor-not-allowed" />
                                </button>
                                <button onClick={() => handleDeleteClick(cat.id, cat.name)} className="font-medium text-red-600 dark:text-red-500 hover:underline p-1">
                                    <Trash2Icon className="w-5 h-5" />
                                </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
        <div>
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Add New Category</h2>
                <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            value={newCategory.name}
                            onChange={handleChange}
                            required 
                            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"
                            placeholder="e.g. Health & Wellness"
                        />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                        <textarea 
                            name="description" 
                            id="description"
                            rows={3}
                            value={newCategory.description}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"
                            placeholder="A short description for the category."
                        />
                    </div>
                     <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
                        <input 
                            type="text" 
                            name="imageUrl" 
                            id="imageUrl" 
                            value={newCategory.imageUrl}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"
                            placeholder="https://example.com/image.jpg"
                        />
                         {newCategory.imageUrl && (
                            <img src={newCategory.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-md bg-slate-100 dark:bg-slate-700" />
                         )}
                    </div>
                    <button 
                        type="submit" 
                        className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-950 transition-all"
                    >
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Add Category
                    </button>
                </form>
            </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

export default AdminCategoriesPage;