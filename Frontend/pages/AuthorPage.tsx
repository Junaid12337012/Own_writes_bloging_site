import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../hooks/useData';
import ArticleRow from '../components/ArticleRow';

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

const AuthorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authors, posts, loading } = useData();

  // Filter published posts
  const publishedPosts = useMemo(() => {
    return posts?.filter(post => post.status === 'published') || [];
  }, [posts]);

  const author = authors?.find(a => a.id === id);
  const authorPosts = publishedPosts.filter(p => p.author.id === id);

  // Show loading state
  if (loading.posts || loading.authors) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading author...</p>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">Author Not Found</h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-zinc-400">The author you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block text-primary-600 dark:text-primary-400 hover:underline font-semibold">
          Go back home
        </Link>
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
      className="max-w-4xl mx-auto"
    >
      <header className="text-center mb-16">
        <img 
          src={author.avatarUrl} 
          alt={author.name} 
          className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg"
        />
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white">
          {author.name}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-zinc-400">
          {author.bio}
        </p>
        <div className="mt-6 flex justify-center items-center space-x-6 text-sm text-gray-500 dark:text-zinc-400">
          <span>{author.followers?.toLocaleString()} followers</span>
          <span>&bull;</span>
          <span>{authorPosts.length} {authorPosts.length === 1 ? 'article' : 'articles'}</span>
        </div>
      </header>

      {authorPosts.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 divide-y divide-gray-200 dark:divide-zinc-700"
        >
          {authorPosts.map((post, index) => (
            <div key={post.id} className={index > 0 ? 'pt-12' : ''}>
              <ArticleRow post={post} />
            </div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-zinc-400 text-lg">
            This author hasn't published any articles yet.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AuthorPage;