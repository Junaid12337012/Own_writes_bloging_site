
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';

interface LikedPostsContextType {
  likedPostIds: string[];
  toggleLiked: (postId: string) => void;
  isLiked: (postId: string) => boolean;
}

export const LikedPostsContext = createContext<LikedPostsContextType | undefined>(undefined);

interface LikedPostsProviderProps {
  children: ReactNode;
}

export const LikedPostsProvider: React.FC<LikedPostsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { updateLikes } = useData();
  const toast = useToast();
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      try {
        const item = window.localStorage.getItem(`likedPosts_${user.id}`);
        if (item) {
          setLikedPostIds(JSON.parse(item));
        } else {
          setLikedPostIds([]);
        }
      } catch (error) {
        console.error("Could not load liked posts from localStorage", error);
        setLikedPostIds([]);
      }
    } else {
      setLikedPostIds([]);
    }
  }, [user]);

  const updateLocalStorage = (ids: string[]) => {
    if (user) {
      try {
        window.localStorage.setItem(`likedPosts_${user.id}`, JSON.stringify(ids));
      } catch (error) {
        console.error("Could not save liked posts to localStorage", error);
      }
    }
  };

  const toggleLiked = useCallback((postId: string) => {
    if (!user) {
      toast.info("Please log in to like posts.");
      return;
    }

    setLikedPostIds(prevIds => {
      const isCurrentlyLiked = prevIds.includes(postId);
      const newIds = isCurrentlyLiked
        ? prevIds.filter(id => id !== postId)
        : [...prevIds, postId];
      
      updateLocalStorage(newIds);
      
      // Update the global like count in DataContext
      updateLikes(postId, !isCurrentlyLiked);

      return newIds;
    });
  }, [user, updateLikes, toast]);

  const isLiked = useCallback((postId: string) => {
    if (!user) return false;
    return likedPostIds.includes(postId);
  }, [likedPostIds, user]);

  return (
    <LikedPostsContext.Provider value={{ likedPostIds, toggleLiked, isLiked }}>
      {children}
    </LikedPostsContext.Provider>
  );
};