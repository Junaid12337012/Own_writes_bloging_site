import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as motionTyped } from 'framer-motion';
import { useData } from '../hooks/useData';
import { Tag } from '../types';
import ArticleRow from '../components/ArticleRow';
import { ArrowLeftIcon, ArrowRightIcon } from '../components/icons';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const POSTS_PER_PAGE = 10;

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { categories, posts, loading } = useData();
  const [currentPage, setCurrentPage] = useState(1);

  // Filter published posts
  const publishedPosts = useMemo(() => {
    return posts?.filter(post => post.status === 'published') || [];
  }, [posts]);

  const category = categories?.find(c => c.id === id);
  
  const filteredPosts = publishedPosts
    .filter(p => p.category.id === id)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
     window.scrollTo(0, 0);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  // Show loading state
  if (loading.posts || loading.categories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Category not found.</h1>
        <Link to="/categories" className="mt-4 inline-block text-primary-600 hover:underline">
          Explore all categories
        </Link>
      </div>
    );
  }
  
  const relatedTags = filteredPosts.reduce((acc: Tag[], post) => {
    post.tags?.forEach(tag => {
      if (!acc.some(t => t.id === tag.id)) {
        acc.push(tag);
      }
    });
    return acc;
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="max-w-4xl mx-auto"
    >
      <header className="border-b border-gray-200 dark:border-zinc-700 pb-8 mb-8">
        <h1 className="text-5xl md:text-6xl font-bold font-serif text-gray-900 dark:text-white">
          {category.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-500 dark:text-zinc-400">
          {category.description}
        </p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'STORY' : 'STORIES'}
        </p>
      </header>

      {relatedTags.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-4">Related Topics</h2>
            <div className="flex flex-wrap gap-3">
                {relatedTags.map(tag => (
                    <Link key={tag.id} to={`/tag/${tag.id}`} className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-zinc-800 border border-transparent rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                        {tag.name}
                    </Link>
                ))}
            </div>
          </div>
      )}

      {currentPosts.length > 0 ? (
        <>
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12 divide-y divide-gray-200 dark:divide-zinc-700"
        >
            {currentPosts.map((post, index) => (
                <div key={post.id} className={index > 0 ? 'pt-12' : ''}>
                    <ArticleRow post={post} />
                </div>
            ))}
        </motion.div>
        
        {totalPages > 1 && (
            <div className="mt-16 flex justify-between items-center">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-300 hover:bg-gray-50 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </button>
              <span className="text-sm text-gray-500 dark:text-zinc-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-300 hover:bg-gray-50 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 border-t border-gray-200 dark:border-zinc-700">
            <p className="text-gray-500 dark:text-zinc-400 text-lg">There are no stories in this category yet.</p>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryPage;