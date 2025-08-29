import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion as motionTyped } from 'framer-motion';
import BlogPostCard from '../components/BlogPostCard';
import { SearchIcon } from '../components/icons';
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

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { posts, loading } = useData();

  // Filter published posts
  const publishedPosts = useMemo(() => {
    return posts?.filter(post => post.status === 'published') || [];
  }, [posts]);

  const filteredPosts = query
    ? publishedPosts.filter(post => {
        const searchTerm = query.toLowerCase();
        
        // Create a temporary div to parse and extract text from HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';

        return (
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          textContent.toLowerCase().includes(searchTerm) ||
          post.author.name.toLowerCase().includes(searchTerm) ||
          post.category.name.toLowerCase().includes(searchTerm)
        );
      })
    : [];

  // Show loading state
  if (loading.posts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading search results...</p>
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
          Search Results
        </h1>
        {query && (
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-zinc-400">
            {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{query}"
          </p>
        )}
      </div>

      {query ? (
        filteredPosts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-zinc-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No results found</h2>
            <p className="text-gray-500 dark:text-zinc-400 mb-8">
              Try adjusting your search terms or browse our categories.
            </p>
            <Link 
              to="/categories" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <SearchIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-zinc-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Start your search</h2>
          <p className="text-gray-500 dark:text-zinc-400">
            Enter a search term to find articles, authors, or topics.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SearchPage;