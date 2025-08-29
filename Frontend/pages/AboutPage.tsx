import React from 'react';
import { motion as motionTyped } from 'framer-motion';
import { useData } from '../hooks/useData';
import { Author } from '../types';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="bg-primary-500/10 dark:bg-primary-400/10 p-6 rounded-xl text-center">
        <p className="text-4xl font-bold font-serif text-primary-600 dark:text-primary-400">{value}</p>
        <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-zinc-400 mt-2">{label}</p>
    </div>
);

const AuthorCard: React.FC<{ author: Author }> = ({ author }) => (
    <div className="text-center">
        <img src={author.avatarUrl} alt={author.name} className="w-32 h-32 rounded-full mx-auto shadow-lg mb-4" />
        <h3 className="text-xl font-bold font-serif text-gray-900 dark:text-white">{author.name}</h3>
        <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm max-w-xs mx-auto">{author.bio}</p>
    </div>
);

const AboutPage: React.FC = () => {
  const { posts, authors, categories, loading } = useData();

  // Show loading state
  if (loading.posts || loading.authors || loading.categories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
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
      transition={{ duration: 0.5 }}
      className="space-y-24"
    >
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl md:text-6xl font-bold font-serif text-gray-900 dark:text-white">Our Story</h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 dark:text-zinc-300">
          Inkwell was born from a simple idea: to create a beautiful, inspiring space for writers to share their stories and for readers to discover new perspectives. We believe in the power of words to connect, educate, and entertain.
        </p>
      </section>

      {/* Stats Section */}
      <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <StatCard value={(posts?.length || 0).toString()} label="Articles Published" />
              <StatCard value={(authors?.length || 0).toString()} label="Talented Authors" />
              <StatCard value={(categories?.length || 0).toString()} label="Topics Covered" />
          </div>
      </section>

      {/* Team Section */}
      <section className="text-center">
        <h2 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">Meet the Team</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-zinc-400">
            The creative minds behind the stories you love.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {authors?.length > 0 ? (
              authors.map(author => (
                <AuthorCard key={author.id} author={author} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-zinc-400">No authors to display yet.</p>
              </div>
            )}
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;