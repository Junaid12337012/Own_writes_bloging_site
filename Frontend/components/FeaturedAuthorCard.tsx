
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Author } from '../types';
import { UserIcon } from './icons';

interface FeaturedAuthorCardProps {
  author: Author & { postCount: number };
}

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
        type: 'spring',
        stiffness: 100,
    }
  },
};

const FeaturedAuthorCard: React.FC<FeaturedAuthorCardProps> = ({ author }) => {
  const formatFollowers = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  return (
    <motion.div variants={cardVariants} className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start space-x-4">
        <Link to={`/author/${author.id}`}>
          <img src={author.avatarUrl} alt={author.name} className="w-16 h-16 rounded-full" />
        </Link>
        <div className="flex-1">
          <Link to={`/author/${author.id}`} className="group">
            <h3 className="font-bold font-serif text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{author.name}</h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">{author.bio}</p>
          <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500 dark:text-zinc-400">
            <span>{author.postCount} posts</span>
            <span className="flex items-center gap-1"><UserIcon className="w-3 h-3"/> {formatFollowers(author.followers)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedAuthorCard;