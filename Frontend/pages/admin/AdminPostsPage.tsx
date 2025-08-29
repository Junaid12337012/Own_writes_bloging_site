import React, { useState } from 'react';
import { motion as motionTyped } from 'framer-motion';
import { Link } from 'react-router-dom';
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

const AdminPostsPage: React.FC = () => {
  const { posts, deletePost } = useData();
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
    
  const handleDeleteClick = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deletePost(deleteTarget.id);
      toast.success(`Post "${deleteTarget.title}" deleted.`);
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Posts</h1>
        <Link 
            to="/admin/posts/new"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-950 transition-all"
        >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-6 py-3 min-w-[250px]">Title</th>
                <th scope="col" className="px-6 py-3">Author</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                  <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {post.title}
                  </th>
                  <td className="px-6 py-4">{post.author.name}</td>
                  <td className="px-6 py-4">{post.category.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                    }`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(post.publishedDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <Link to={`/admin/posts/edit/${post.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline p-1">
                          <EditIcon className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDeleteClick(post.id, post.title)} className="font-medium text-red-600 dark:text-red-500 hover:underline p-1">
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
        title="Delete Post"
        message={`Are you sure you want to delete the post "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

export default AdminPostsPage;