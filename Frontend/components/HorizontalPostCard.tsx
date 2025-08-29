import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Post } from '../types';

interface HorizontalPostCardProps {
  post: Post;
}

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const HorizontalPostCard: React.FC<HorizontalPostCardProps> = ({ post }) => {
  return (
    <motion.div variants={itemVariants} className="w-72 sm:w-80 flex-shrink-0">
      <Link to={`/post/${post.id}`} className="block group">
        <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-shadow">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{post.category.name}</p>
          <h3 className="mt-1 text-lg font-bold font-serif leading-tight text-slate-900 dark:text-white group-hover:underline">{post.title}</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">{new Date(post.publishedDate).toLocaleDateString()} &middot; {post.readingTime} min read</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default HorizontalPostCard;