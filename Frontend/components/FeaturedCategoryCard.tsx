import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../types';

interface FeaturedCategoryCardProps {
  category: Category;
  postCount: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedCategoryCard: React.FC<FeaturedCategoryCardProps> = ({ category, postCount }) => {
  return (
    <motion.div variants={itemVariants} className="relative rounded-xl overflow-hidden group shadow-lg">
      <Link to={`/category/${category.id}`} className="block">
        <img src={category.imageUrl} alt={category.name} className="w-full h-48 sm:h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h3 className="text-2xl font-bold font-serif">{category.name}</h3>
          <p className="text-sm opacity-80 mt-1">{postCount} {postCount === 1 ? 'Article' : 'Articles'}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeaturedCategoryCard;
