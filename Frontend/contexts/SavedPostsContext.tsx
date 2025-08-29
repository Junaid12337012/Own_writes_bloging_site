
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface SavedPostsContextType {
  savedPostIds: string[];
  toggleSaved: (postId: string) => void;
  isSaved: (postId: string) => boolean;
}

export const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

interface SavedPostsProviderProps {
  children: ReactNode;
}

export const SavedPostsProvider: React.FC<SavedPostsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      try {
        const item = window.localStorage.getItem(`savedPosts_${user.id}`);
        if (item) {
          setSavedPostIds(JSON.parse(item));
        } else {
          setSavedPostIds([]);
        }
      } catch (error) {
        console.error("Could not load saved posts from localStorage", error);
        setSavedPostIds([]);
      }
    } else {
      setSavedPostIds([]);
    }
  }, [user]);

  const updateLocalStorage = (ids: string[]) => {
    if (user) {
      try {
        window.localStorage.setItem(`savedPosts_${user.id}`, JSON.stringify(ids));
      } catch (error) {
        console.error("Could not save posts to localStorage", error);
      }
    }
  }

  const toggleSaved = useCallback((postId: string) => {
    if (!user) {
      toast.info("Please log in to save posts to your reading list.");
      return;
    }
    setSavedPostIds(prevIds => {
      const newIds = prevIds.includes(postId)
        ? prevIds.filter(id => id !== postId)
        : [...prevIds, postId];
      updateLocalStorage(newIds);
      return newIds;
    });
  }, [user, toast]);

  const isSaved = useCallback((postId: string) => {
    if (!user) return false;
    return savedPostIds.includes(postId);
  }, [savedPostIds, user]);


  return (
    <SavedPostsContext.Provider value={{ savedPostIds, toggleSaved, isSaved }}>
      {children}
    </SavedPostsContext.Provider>
  );
};