import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post } from '../types';

interface BookmarksContextType {
  bookmarkedPosts: Post[];
  isBookmarked: (postId: string) => boolean;
  toggleBookmark: (post: Post) => void;
  removeBookmark: (postId: string) => void;
  clearAllBookmarks: () => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const BookmarksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('blog_bookmarks');
    if (savedBookmarks) {
      try {
        const parsed = JSON.parse(savedBookmarks);
        setBookmarkedPosts(parsed);
      } catch (error) {
        console.error('Failed to parse saved bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('blog_bookmarks', JSON.stringify(bookmarkedPosts));
  }, [bookmarkedPosts]);

  const isBookmarked = (postId: string): boolean => {
    return bookmarkedPosts.some(post => post.id === postId);
  };

  const toggleBookmark = (post: Post) => {
    setBookmarkedPosts(prev => {
      const isCurrentlyBookmarked = prev.some(p => p.id === post.id);
      
      if (isCurrentlyBookmarked) {
        // Remove bookmark
        return prev.filter(p => p.id !== post.id);
      } else {
        // Add bookmark
        return [...prev, post];
      }
    });
  };

  const removeBookmark = (postId: string) => {
    setBookmarkedPosts(prev => prev.filter(post => post.id !== postId));
  };

  const clearAllBookmarks = () => {
    setBookmarkedPosts([]);
  };

  const value: BookmarksContextType = {
    bookmarkedPosts,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = (): BookmarksContextType => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};
