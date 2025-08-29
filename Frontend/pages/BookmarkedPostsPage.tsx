import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../contexts/BookmarksContext';
import BlogPostCard from '../components/BlogPostCard';
import { BookmarkIcon, ArrowRightIcon } from '../components/icons';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const BookmarkedPostsPage: React.FC = () => {
  const { bookmarkedPosts, clearAllBookmarks } = useBookmarks();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <BookmarkIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white mb-4"
          >
            Bookmarked Posts
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Your personal collection of saved articles to read later
          </motion.p>

          {bookmarkedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {bookmarkedPosts.length} {bookmarkedPosts.length === 1 ? 'post' : 'posts'} bookmarked
              </div>
              <button
                onClick={clearAllBookmarks}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
              >
                Clear all bookmarks
              </button>
            </motion.div>
          )}
        </div>

        {/* Bookmarked Posts Grid */}
        {bookmarkedPosts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {bookmarkedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <BlogPostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <BookmarkIcon className="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Start bookmarking posts you want to read later. Click the bookmark icon on any post to save it here.
                </p>
              </div>
              
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Explore Posts
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Reading Tips */}
        {bookmarkedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 bg-slate-50 dark:bg-slate-800 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              📚 Reading Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Organize Your Reading
                </h4>
                <p>
                  Bookmark posts by topic or priority to create your personalized reading list.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Share Your Favorites
                </h4>
                <p>
                  Use the share buttons on posts to recommend your bookmarked articles to others.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BookmarkedPostsPage;
