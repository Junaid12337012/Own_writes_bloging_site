import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion as motionTyped } from 'framer-motion';
import BlogPostCard from '../components/BlogPostCard';
import { useSavedPosts } from '../hooks/useSavedPosts';
import { BookmarkIcon } from '../components/icons';
import { useData } from '../hooks/useData';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const SavedPostsPage: React.FC = () => {
  const { savedPostIds } = useSavedPosts();
  const { posts, loading } = useData();
  
  // Filter published posts
  const publishedPosts = useMemo(() => {
    return posts?.filter(post => post.status === 'published') || [];
  }, [posts]);
  
  const savedPosts = publishedPosts.filter(post => savedPostIds.includes(post.id));

  // Show loading state
  if (loading.posts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading saved posts...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white sm:text-5xl">
          Saved Articles
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-zinc-400">
          Your personal collection of articles to read later.
        </p>
      </div>

      {savedPosts.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {savedPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <BookmarkIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-zinc-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No saved articles yet</h2>
          <p className="text-gray-500 dark:text-zinc-400 mb-8">
            Start saving articles you want to read later by clicking the bookmark icon.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Explore Articles
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default SavedPostsPage;