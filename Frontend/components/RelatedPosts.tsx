import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { ClockIcon, ArrowRightIcon } from './icons';
import BookmarkButton from './BookmarkButton';

interface RelatedPostsProps {
  currentPost: Post;
  allPosts: Post[];
  maxPosts?: number;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ 
  currentPost, 
  allPosts, 
  maxPosts = 3 
}) => {
  // Algorithm to find related posts
  const getRelatedPosts = (): Post[] => {
    const related = allPosts
      .filter(post => post.id !== currentPost.id && post.status === 'published')
      .map(post => {
        let score = 0;
        
        // Same category gets high score
        if (post.category.id === currentPost.category.id) {
          score += 10;
        }
        
        // Shared tags get medium score
        const sharedTags = post.tags.filter(tag => 
          currentPost.tags.some(currentTag => currentTag.id === tag.id)
        );
        score += sharedTags.length * 5;
        
        // Same author gets low score
        if (post.author.id === currentPost.author.id) {
          score += 2;
        }
        
        // Recent posts get slight boost
        const daysDiff = Math.abs(
          new Date(post.publishedDate).getTime() - new Date(currentPost.publishedDate).getTime()
        ) / (1000 * 60 * 60 * 24);
        
        if (daysDiff < 30) {
          score += 1;
        }
        
        return { post, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPosts)
      .map(item => item.post);
    
    return related;
  };

  const relatedPosts = getRelatedPosts();

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Related Posts
        </h3>
        <ArrowRightIcon className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-4">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <Link
              to={`/post/${post.id}`}
              className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              {/* Post Image */}
              <div className="flex-shrink-0">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>

              {/* Post Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-1">
                  {post.title}
                </h4>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {post.readingTime} min read
                  </div>
                  
                  <BookmarkButton post={post} size="sm" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* View More Link */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link
          to={`/category/${currentPost.category.id}`}
          className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          More in {currentPost.category.name}
          <ArrowRightIcon className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default RelatedPosts;
