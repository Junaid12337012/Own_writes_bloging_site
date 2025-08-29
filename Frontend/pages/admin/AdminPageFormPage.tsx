import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Page } from '../../types';
import { useData } from '../../hooks/useData';
import RichTextEditor from '../../components/admin/RichTextEditor';
import Accordion from '../../components/admin/Accordion';
import { useToast } from '../../hooks/useToast';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const AdminPageFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pages, updatePage } = useData();
  const toast = useToast();
  
  const [page, setPage] = useState<Partial<Page>>({
    title: '',
    content: '',
  });

  useEffect(() => {
    const existingPage = pages.find(p => p.id === id);
    if (existingPage) {
      setPage(existingPage);
    } else {
      navigate('/admin/pages');
    }
  }, [id, pages, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPage(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setPage(prev => ({...prev, content}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page.title) {
        toast.error("Title is required.");
        return;
    }
    
    if (!page.id) {
        toast.error("Page ID is missing.");
        return;
    }

    try {
        const success = await updatePage(page.id as string, {
            title: page.title,
            content: page.content
        });
        if (success) {
            toast.success(`Page "${page.title}" saved successfully!`);
            navigate('/admin/pages');
        } else {
            toast.error("Failed to update page.");
        }
    } catch (error) {
        toast.error("An error occurred while updating the page.");
    }
  };

  if (!page) {
    return null; 
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Edit Page
          </h1>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('/admin/pages')} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-950 transition-all">
                Cancel
            </button>
            <button type="submit" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-950 transition-all">
                Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 space-y-6">
                 <div>
                    <label htmlFor="title" className="sr-only">Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="title" 
                        value={page.title} 
                        onChange={handleChange} 
                        required 
                        className="block w-full text-2xl font-bold p-3 rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700" 
                        placeholder="Page Title"
                    />
                </div>
                <RichTextEditor
                    value={page.content || ''}
                    onChange={handleContentChange}
                />
            </div>

            <aside className="sticky top-24">
                <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
                   <Accordion title="Publish" defaultOpen={true}>
                       <div className="space-y-4">
                           <p className="text-sm text-slate-500 dark:text-slate-400">Click the button below to save all your changes.</p>
                           <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-950 transition-all">
                                Save Changes
                            </button>
                       </div>
                   </Accordion>

                   <Accordion title="Page Attributes" defaultOpen={true}>
                       <div>
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 p-2 rounded-md">/{page.slug}</p>
                       </div>
                   </Accordion>
                </div>
            </aside>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminPageFormPage;