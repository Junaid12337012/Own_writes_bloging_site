import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, EditIcon, Trash2Icon } from '../../components/icons';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const AdminAuthorsPage: React.FC = () => {
  const { authors, deleteAuthor } = useData();
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
    
  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        const success = await deleteAuthor(deleteTarget.id);
        if (success) {
          toast.success(`Author "${deleteTarget.name}" deleted.`);
        } else {
          toast.error(`Failed to delete "${deleteTarget.name}".`);
        }
      } catch (error: any) {
        toast.error(error.message || `Cannot delete "${deleteTarget.name}". This author has published posts. Please delete all posts by this author first.`);
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Authors</h1>
        <Link 
            to="/admin/authors/new"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-950 transition-all"
        >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            New Author
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-6 py-3 min-w-[250px]">Author</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {authors.map(author => (
                <tr key={author.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                        <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full mr-4" />
                        <div>
                            <div className="font-medium text-slate-900 dark:text-white">{author.name}</div>
                            <div className="text-xs text-slate-500">{author.bio}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <Link to={`/admin/authors/edit/${author.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline p-1">
                          <EditIcon className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDeleteClick(author.id, author.name)} className="font-medium text-red-600 dark:text-red-500 hover:underline p-1">
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
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Author"
        message={`Are you sure you want to delete the author "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

export default AdminAuthorsPage;