import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { motion as motionTyped } from 'framer-motion';
import { useBookmarks } from '../contexts/BookmarksContext';
import BookmarkButton from './BookmarkButton';

interface BlogPostCardProps {
  post: Post;
}

const motion = motionTyped as any;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <motion.div 
      variants={cardVariants} 
      className="relative flex flex-col rounded-lg shadow-lg overflow-hidden h-full bg-white dark:bg-zinc-800 group transition-shadow duration-300 hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-400/10"
    >
      <div className="absolute top-4 right-4 z-20">
        <BookmarkButton post={post} className="p-2 rounded-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-zinc-900/70 transition-colors" />
      </div>
      
      <div className="flex-shrink-0 overflow-hidden">
        <Link to={`/post/${post.id}`}>
          <img className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" src={post.imageUrl} alt={post.title} />
        </Link>
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          <Link 
            to={`/category/${post.category.id}`} 
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline z-10 relative"
          >
            {post.category.name}
          </Link>
          <Link to={`/post/${post.id}`}>
            <h3 className="mt-2 text-xl font-semibold font-serif text-gray-900 dark:text-zinc-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {post.title}
            </h3>
          </Link>
          <Link to={`/post/${post.id}`}>
            <p className="mt-3 text-base text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors">
              {post.excerpt}
            </p>
          </Link>
        </div>
        <Link to={`/author/${post.author.id}`} className="mt-6 flex items-center group/author z-10 relative">
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={post.author.avatarUrl} alt={post.author.name} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-zinc-100 group-hover/author:underline">{post.author.name}</p>
            <div className="flex space-x-1 text-sm text-gray-500 dark:text-zinc-400">
              <time dateTime={post.publishedDate}>{new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogPostCard;