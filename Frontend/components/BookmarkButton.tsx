import React from 'react';
import { motion } from 'framer-motion';
import { BookmarkIcon, BookmarkFilledIcon } from './icons';
import { useBookmarks } from '../contexts/BookmarksContext';
import { Post } from '../types';
import { useToast } from '../hooks/useToast';

interface BookmarkButtonProps {
  post: Post;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  post, 
  className = '', 
  showText = false,
  size = 'md'
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const toast = useToast();
  const bookmarked = isBookmarked(post.id);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleBookmark(post);
    
    if (bookmarked) {
      toast.success('Removed from bookmarks');
    } else {
      toast.success('Added to bookmarks');
    }
  };

  return (
    <motion.button
      onClick={handleToggleBookmark}
      className={`inline-flex items-center transition-colors ${className} ${
        bookmarked 
          ? 'text-primary-600 dark:text-primary-400' 
          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <BookmarkFilledIcon className={sizeClasses[size]} />
      ) : (
        <BookmarkIcon className={sizeClasses[size]} />
      )}
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </motion.button>
  );
};

export default BookmarkButton;
