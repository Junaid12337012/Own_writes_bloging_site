import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { motion } from 'framer-motion';

interface MainFeaturedPostCardProps {
  post: Post;
}

const MainFeaturedPostCard: React.FC<MainFeaturedPostCardProps> = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-zinc-800/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="order-2 md:order-1">
        <Link to={`/category/${post.category.id}`} className="text-sm font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:underline">
          {post.category.name}
        </Link>
        <Link to={`/post/${post.id}`}>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold font-serif text-gray-900 dark:text-white leading-tight group-hover:underline">
            {post.title}
          </h2>
        </Link>
        <p className="mt-4 text-base text-gray-600 dark:text-zinc-400 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-6 flex items-center">
          <Link to={`/author/${post.author.id}`}>
            <img className="h-10 w-10 rounded-full" src={post.author.avatarUrl} alt={post.author.name} />
          </Link>
          <div className="ml-3">
            <Link to={`/author/${post.author.id}`} className="text-sm font-medium text-gray-900 dark:text-zinc-100 hover:underline">{post.author.name}</Link>
            <div className="flex space-x-1 text-sm text-gray-500 dark:text-zinc-400">
              <time dateTime={post.publishedDate}>{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</time>
              <span>&middot;</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>
      <div className="order-1 md:order-2">
        <Link to={`/post/${post.id}`}>
          <div className="aspect-video w-full overflow-hidden rounded-lg shadow-md">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default MainFeaturedPostCard;