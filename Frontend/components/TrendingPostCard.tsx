import React from 'react';
import { motion as motionTyped } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface TrendingPostCardProps {
    post: Post;
    index: number;
}

const motion = motionTyped as any;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TrendingPostCard: React.FC<TrendingPostCardProps> = ({ post, index }) => {
    return (
        <motion.div variants={itemVariants} className="w-full">
             <div className="group flex items-start space-x-4 h-full">
                <div className="text-4xl font-bold font-serif text-slate-300 dark:text-slate-600">
                    {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                     <Link to={`/author/${post.author.id}`} onClick={(e) => e.stopPropagation()} className="group/author flex items-center space-x-2 mb-1 z-10 relative">
                        <img src={post.author.avatarUrl} alt={post.author.name} className="w-5 h-5 rounded-full" />
                        <span className="text-xs font-semibold group-hover/author:underline">{post.author.name}</span>
                     </Link>
                    <Link to={`/post/${post.id}`}>
                        <h3 className="font-semibold font-serif text-base leading-tight mt-1 group-hover:underline">{post.title}</h3>
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} &middot; {post.readingTime} min read</p>
                </div>
            </div>
        </motion.div>
    );
};

export default TrendingPostCard;