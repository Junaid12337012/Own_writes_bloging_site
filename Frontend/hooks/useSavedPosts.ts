import { useContext } from 'react';
import { SavedPostsContext } from '../contexts/SavedPostsContext';

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (context === undefined) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
};