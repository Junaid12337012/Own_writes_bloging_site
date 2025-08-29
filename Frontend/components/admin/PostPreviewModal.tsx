import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { XIcon } from '../icons';
import { Link } from 'react-router-dom';

interface PostPreviewModalProps {
  post: Partial<Post>;
  onClose: () => void;
}

const PostPreviewModal: React.FC<PostPreviewModalProps> = ({ post, onClose }) => {
    const { theme } = useTheme();

    const author = post.author || { id: '', name: 'Author Name', avatarUrl: '', bio: '', followers: 0 };
    const category = post.category || { id: '', name: 'Category', description: '', imageUrl: '' };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    className={`${theme} w-full h-full flex flex-col`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <header className="flex-shrink-0 flex justify-between items-center p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <p className="text-sm font-semibold">Live Preview</p>
                        <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </header>
                    <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans">
                        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                             <main>
                                <article>
                                    <header className="text-center mb-12">
                                        <div className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                                            {category.name}
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white leading-tight mt-2">
                                            {post.title || 'Untitled Post'}
                                        </h1>
                                        <div className="mt-6 flex justify-center items-center space-x-4 text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center space-x-2">
                                                {author.avatarUrl && <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full" />}
                                                <span>{author.name}</span>
                                            </div>
                                            <span>&middot;</span>
                                            <time>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                            <span>&middot;</span>
                                            <span>{post.readingTime || 0} min read</span>
                                        </div>
                                    </header>

                                    {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg mb-12" />}

                                    <div 
                                    className="prose prose-lg dark:prose-invert max-w-none mx-auto text-slate-700 dark:text-slate-300 font-serif leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: post.content || '<p>Start writing your content...</p>' }}
                                    />
                                </article>
                            </main>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PostPreviewModal;
