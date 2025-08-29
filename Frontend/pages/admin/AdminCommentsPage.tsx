import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { Comment } from '../../types';
import { Trash2Icon, CheckIcon, BanIcon } from '../../components/icons';
import { useToast } from '../../hooks/useToast';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

type StatusFilter = 'all' | 'pending' | 'approved' | 'spam';

const StatusBadge: React.FC<{ status: Comment['status'] }> = ({ status }) => {
  const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  const styles = {
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    spam: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return <span className={`${baseClasses} ${styles[status]}`}>{status}</span>;
};

const AdminCommentsPage: React.FC = () => {
  const { comments, posts, updateCommentStatus, deleteComment, loading, refreshComments } = useData();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const toast = useToast();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Refresh comments on component mount
  React.useEffect(() => {
    refreshComments();
  }, []); // Empty dependency array to run only once

  const filteredComments = useMemo(() => {
    if (filter === 'all') return comments;
    return comments.filter(comment => comment.status === filter);
  }, [comments, filter]);

  const getPostTitle = (postId: string) => {
    return posts.find(p => p.id === postId)?.title || 'Unknown Post';
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteComment(deleteTargetId);
      toast.success('Comment deleted.');
      setDeleteTargetId(null);
    }
  };
  
  const handleUpdateStatus = (id: string, status: Comment['status']) => {
    updateCommentStatus(id, status);
    toast.success(`Comment marked as ${status}.`);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Manage Comments</h1>
      
      <div className="mb-4 flex items-center border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {(['all', 'pending', 'approved', 'spam'] as StatusFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors flex-shrink-0 ${
              filter === f
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
        {loading.comments ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Loading comments...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              {filter === 'all' ? 'No comments found.' : `No ${filter} comments found.`}
            </p>
            <button 
              onClick={refreshComments}
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
                  <th scope="col" className="px-6 py-3 min-w-[200px]">Author</th>
                  <th scope="col" className="px-6 py-3 min-w-[250px]">Comment</th>
                  <th scope="col" className="px-6 py-3 min-w-[200px]">In Response To</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Submitted On</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.map(comment => (
                  <tr key={comment.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={comment.authorAvatarUrl} alt={comment.authorName} className="w-8 h-8 rounded-full mr-3" />
                        <span className="font-medium text-slate-900 dark:text-white">{comment.authorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate">{comment.text}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/post/${comment.postId}`} target="_blank" className="hover:underline text-primary-600 dark:text-primary-400">
                          {getPostTitle(comment.postId)}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={comment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{comment.timestamp}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-center space-x-2">
                          {comment.status !== 'approved' && (
                              <button onClick={() => handleUpdateStatus(comment.id, 'approved')} title="Approve" className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full transition-colors"><CheckIcon className="w-4 h-4" /></button>
                          )}
                          {comment.status !== 'spam' && (
                               <button onClick={() => handleUpdateStatus(comment.id, 'spam')} title="Mark as Spam" className="p-2 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-full transition-colors"><BanIcon className="w-4 h-4" /></button>
                          )}
                          <button onClick={() => handleDeleteClick(comment.id)} title="Delete" className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"><Trash2Icon className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
       <ConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        message="Are you sure you want to permanently delete this comment? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

export default AdminCommentsPage;
