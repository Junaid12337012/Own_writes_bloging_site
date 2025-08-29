import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Author } from '../../types';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const AdminAuthorFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authors, addAuthor, updateAuthor } = useData();
  const toast = useToast();

  const isEditing = Boolean(id);
  
  const [author, setAuthor] = useState<Partial<Author>>({
    name: '',
    avatarUrl: '',
    bio: '',
  });

  useEffect(() => {
    if (isEditing) {
      const existingAuthor = authors.find(a => a.id === id);
      if (existingAuthor) {
        setAuthor(existingAuthor);
      }
    }
  }, [id, isEditing, authors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAuthor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.name || !author.avatarUrl || !author.bio) {
        toast.error("Please fill in all required fields.");
        return;
    }

    if (isEditing) {
      updateAuthor(author as Author);
      toast.success(`Author "${author.name}" updated.`);
    } else {
      addAuthor(author as Omit<Author, 'id'>);
      toast.success(`Author "${author.name}" created.`);
    }
    
    navigate('/admin/authors');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        {isEditing ? 'Edit Author' : 'Create New Author'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
            <input type="text" name="name" id="name" value={author.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Avatar URL</label>
            <div className="flex items-center gap-4 mt-1">
                <input type="text" name="avatarUrl" id="avatarUrl" value={author.avatarUrl} onChange={handleChange} required className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm" placeholder="https://..." />
                {author.avatarUrl && (
                    <img src={author.avatarUrl} alt="Avatar Preview" className="w-16 h-16 object-cover rounded-full flex-shrink-0 bg-slate-100 dark:bg-slate-700" />
                )}
            </div>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
            <textarea name="bio" id="bio" rows={3} value={author.bio} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"></textarea>
          </div>

        </div>

        <div className="mt-8 flex justify-end">
          <button type="button" onClick={() => navigate('/admin/authors')} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-full hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-950 transition-all">
            Cancel
          </button>
          <button type="submit" className="ml-3 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-950 transition-all">
            {isEditing ? 'Save Changes' : 'Create Author'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminAuthorFormPage;