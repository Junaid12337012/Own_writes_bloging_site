import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { motion as motionTyped } from 'framer-motion';
import { useSavedPosts } from '../hooks/useSavedPosts';
import { BookmarkIcon } from './icons';

interface ArticleRowProps {
  post: Post;
}

const motion = motionTyped as any;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ArticleRow: React.FC<ArticleRowProps> = ({ post }) => {
  const { isSaved, toggleSaved } = useSavedPosts();
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(post.id);
  };

  return (
    <motion.div variants={itemVariants} className="w-full">
      <Link to={`/author/${post.author.id}`} className="group inline-flex items-center mb-4">
        <img className="h-6 w-6 rounded-full mr-2" src={post.author.avatarUrl} alt={post.author.name} />
        <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:underline transition-colors">{post.author.name}</p>
      </Link>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8">
            <Link to={`/post/${post.id}`} className="block group">
                <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white group-hover:underline">
                    {post.title}
                </h2>
                <p className="mt-2 text-base text-gray-500 dark:text-zinc-400 line-clamp-2 md:line-clamp-3">
                    {post.excerpt}
                </p>
            </Link>
             <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-zinc-400">
                    <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readingTime} min read</span>
                     <Link to={`/category/${post.category.id}`} className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                        {post.category.name}
                    </Link>
                </div>
                <div className="flex items-center">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleBookmarkClick}
                        className="p-2 rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                        aria-label={isSaved(post.id) ? 'Unsave this post' : 'Save this post'}
                    >
                        <BookmarkIcon className="w-5 h-5" filled={isSaved(post.id)} />
                    </motion.button>
                </div>
            </div>
        </div>
        <div className="col-span-12 md:col-span-4">
            <Link to={`/post/${post.id}`} className="block aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-zinc-700">
                <img className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" src={post.imageUrl} alt={post.title} />
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleRow;