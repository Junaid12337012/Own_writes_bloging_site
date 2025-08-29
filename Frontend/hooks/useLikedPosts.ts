import { useContext } from 'react';
import { LikedPostsContext } from '../contexts/LikedPostsContext';

export const useLikedPosts = () => {
  const context = useContext(LikedPostsContext);
  if (context === undefined) {
    throw new Error('useLikedPosts must be used within a LikedPostsProvider');
  }
  return context;
};
