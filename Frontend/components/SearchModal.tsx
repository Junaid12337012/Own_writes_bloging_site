import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '../types';
import { useData } from '../hooks/useData';
import { SearchIcon } from './icons';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Post[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const { posts } = useData();
    const navigate = useNavigate();

    // Filter published posts
    const publishedPosts = useMemo(() => {
        return posts?.filter(post => post.status === 'published') || [];
    }, [posts]);

    useEffect(() => {
        if (isOpen) {
            // Autofocus input when modal opens
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            // Reset state when closed
            setSearchQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    useEffect(() => {
        if (!searchQuery.trim()) {
          setResults([]);
          return;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        const tempDiv = document.createElement('div');

        const filtered = publishedPosts.filter(post => {
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            return (
              post.title.toLowerCase().includes(lowercasedQuery) ||
              post.excerpt.toLowerCase().includes(lowercasedQuery) ||
              textContent.toLowerCase().includes(lowercasedQuery) ||
              post.author.name.toLowerCase().includes(lowercasedQuery) ||
              post.category.name.toLowerCase().includes(lowercasedQuery)
            );
        });
        setResults(filtered.slice(0, 10));
    }, [searchQuery, publishedPosts]);
    
    const handleResultClick = (postId: string) => {
        navigate(`/post/${postId}`);
        onClose();
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32 bg-slate-900/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-2xl bg-white dark:bg-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                ref={inputRef}
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for articles, topics, or authors..."
                                className="block w-full border-0 bg-transparent py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                            />
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto border-t border-gray-200 dark:border-zinc-700 hide-scrollbar">
                             {searchQuery && results.length > 0 && (
                                <ul>
                                    {results.map(post => (
                                        <li key={post.id} className="border-b border-gray-200 dark:border-zinc-700 last:border-b-0">
                                            <button
                                                onClick={() => handleResultClick(post.id)}
                                                className="w-full flex items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"
                                            >
                                                <img src={post.imageUrl} alt="" className="w-16 h-10 object-cover rounded-md mr-4 flex-shrink-0 bg-gray-200 dark:bg-zinc-700"/>
                                                <div className="overflow-hidden">
                                                    <h3 className="font-semibold text-gray-800 dark:text-zinc-100 truncate">{post.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-zinc-400">By {post.author.name} in {post.category.name}</p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {searchQuery && results.length === 0 && (
                                <div className="text-center p-12">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">No results found</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Try a different search query.</p>
                                </div>
                            )}
                            {!searchQuery && (
                                <div className="text-center p-12">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Find something amazing</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Start typing to search the entire blog.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;