import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion as motionTyped, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { useData } from '../../hooks/useData';
import { GoogleGenAI } from '@google/genai';
import { EyeIcon, PenLineIcon, ArrowLeftIcon, ChevronsLeftIcon, ChevronsRightIcon, Settings2Icon } from '../../components/icons';
import ImageGenerationModal from '../../components/admin/ImageGenerationModal';
import RichTextEditor from '../../components/admin/RichTextEditor';
import PostSidebar from '../../components/admin/PostSidebar';
import PostPreviewModal from '../../components/admin/PostPreviewModal';
import SnippetsSidebar from '../../components/admin/SnippetsSidebar';
import { useToast } from '../../hooks/useToast';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const motion = motionTyped as any;

const API_KEY = process.env.API_KEY;

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const AdminPostFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, authors, categories, createPost, updatePost, siteSettings } = useData();
  const toast = useToast();

  const isEditing = Boolean(id);
  
  const defaultPostState = useMemo((): Partial<Post> => ({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    author: authors.length > 0 ? authors[0] : undefined,
    category: categories.length > 0 ? categories[0] : undefined,
    tags: [],
    readingTime: 0,
    featured: false,
    status: 'draft',
    history: [],
  }), [authors, categories]);

  const [post, setPost] = useState<Partial<Post>>(defaultPostState);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSnippetsPanelOpen, setIsSnippetsPanelOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>('never');
  const saveTimeoutRef = useRef<number | null>(null);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);


  const editorStats = useMemo(() => {
    if (!post.content) return { words: 0, characters: 0, minutes: 0 };
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const characters = text.length;
    const minutes = Math.ceil(words / 200);
    return { words, characters, minutes };
  }, [post.content]);

  useEffect(() => {
    if (isEditing) {
      const existingPost = posts.find(p => p.id === id);
      if (existingPost) {
        setPost(existingPost);
        setLastSaved('saved');
      } else {
        navigate('/admin/posts');
      }
    } else {
      setPost(defaultPostState);
    }
  }, [id, isEditing, posts, navigate, defaultPostState]);

  useEffect(() => {
    setPost(prev => ({ ...prev, readingTime: editorStats.minutes }));
  }, [editorStats.minutes]);

  // Autosave simulation effect
  useEffect(() => {
      if (lastSaved === 'saved' || !isEditing) return; // Don't trigger on initial load for existing posts

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      setLastSaved('Unsaved changes');
      
      saveTimeoutRef.current = window.setTimeout(() => {
        // Here you would actually save to a backend/localStorage
        // For this demo, we just update the timestamp
        setLastSaved(`Saved at ${new Date().toLocaleTimeString()}`);
      }, 1500); // Auto-save after 1.5 seconds of inactivity
      
      return () => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      };
  }, [post, isEditing]);

  // Live update for browser tab title
  useEffect(() => {
    const baseTitle = siteSettings.title;
    if (isEditing) {
      document.title = `Editing: ${post.title || 'Untitled Post'} - ${baseTitle}`;
    } else {
      document.title = `New Post - ${baseTitle}`;
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [isEditing, post.title, siteSettings.title]);


  const handleContentChange = (content: string) => {
    setPost(prev => ({...prev, content }));
  }

  const handleGenerateExcerpt = async () => {
    if (!API_KEY) {
        toast.error('API Key is not configured.');
        return;
    }
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content || '';
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

     if (textContent.trim().length < 100) {
        toast.error('Please write at least 100 characters of content to generate an excerpt.');
        return;
    }
    
    setIsGeneratingExcerpt(true);
    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const prompt = `Based on the following article content, generate a compelling, SEO-friendly meta description (excerpt) of around 155 characters. Return only the text of the description, without any extra formatting or labels.\n\nCONTENT:\n${textContent.substring(0, 4000)}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const generatedExcerpt = response.text.trim();
        setPost(prev => ({ ...prev, excerpt: generatedExcerpt }));
        toast.success("AI-powered excerpt generated!");
    } catch (err) {
        console.error("Excerpt generation error:", err);
        toast.error("Failed to generate excerpt. Please try again.");
    } finally {
        setIsGeneratingExcerpt(false);
    }
  };
  
  const handleSubmit = (status: 'published' | 'draft') => {
    if (!post.title || !post.author || !post.category) {
        toast.error("Please fill in the Title, Author, and Category fields.");
        return;
    }

    setIsSaving(true);
    const postToSave = { ...post, status, readingTime: editorStats.minutes };

    setTimeout(async () => {
      try {
        let success = false;
        if (isEditing && post.id) {
          success = await updatePost(post.id, postToSave);
        } else {
          success = await createPost(postToSave);
        }
        
        if (success) {
          toast.success(`Post ${status === 'published' ? 'published' : 'saved'} successfully!`);
          navigate('/admin/posts');
        } else {
          toast.error(`Failed to ${status === 'published' ? 'publish' : 'save'} post.`);
        }
      } catch (error) {
        toast.error('An error occurred while saving the post.');
      } finally {
        setIsSaving(false);
      }
    }, 500);
  };
  
  const handleRestoreRevisionClick = (content: string) => {
    setRestoreTarget(content);
  };

  const handleConfirmRestore = () => {
    if (restoreTarget !== null) {
      setPost(prev => ({...prev, content: restoreTarget}));
      toast.info("Content restored from revision.");
      setRestoreTarget(null);
    }
  };


  return (
    <>
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-slate-950"
    >
        <header className="flex-shrink-0 flex justify-between items-center py-2 px-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex items-center gap-2">
                 <button onClick={() => navigate('/admin/posts')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <ArrowLeftIcon className="w-5 h-5" />
                 </button>
                 <div className="text-sm text-slate-500 dark:text-slate-400">
                    {lastSaved === 'saved' ? 'All changes saved' : lastSaved}
                 </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <button type="button" onClick={() => setIsSnippetsPanelOpen(!isSnippetsPanelOpen)} className={`hidden lg:flex p-2 rounded-md transition-colors ${isSnippetsPanelOpen ? 'bg-primary-100 text-primary-600 dark:bg-primary-800/50 dark:text-primary-300' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    <ChevronsLeftIcon className="w-5 h-5"/>
                </button>
                <button type="button" onClick={() => handleSubmit('draft')} disabled={isSaving} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white rounded-full border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 disabled:opacity-50 transition-all">
                    {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <button type="button" onClick={() => handleSubmit('published')} disabled={isSaving} className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 disabled:opacity-50 transition-all">
                     {isSaving ? 'Publishing...' : (isEditing && post.status === 'published' ? 'Update' : 'Publish')}
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                <button type="button" onClick={() => setIsPreviewOpen(true)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <EyeIcon className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)} className={`p-2 rounded-md transition-colors ${isSettingsPanelOpen ? 'bg-primary-100 text-primary-600 dark:bg-primary-800/50 dark:text-primary-300' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    <ChevronsRightIcon className="w-5 h-5"/>
                </button>
            </div>
        </header>
      
        <div className="flex-1 flex overflow-hidden">
            <AnimatePresence>
                {isSnippetsPanelOpen && (
                     <motion.aside 
                        initial={{ width: 0, opacity: 0, padding: 0 }}
                        animate={{ width: 320, opacity: 1, padding: "1rem" }}
                        exit={{ width: 0, opacity: 0, padding: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="hidden lg:block flex-shrink-0 h-full overflow-y-auto bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 hide-scrollbar"
                    >
                        <SnippetsSidebar />
                    </motion.aside>
                )}
            </AnimatePresence>
            
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 hide-scrollbar">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div>
                        <label htmlFor="title" className="sr-only">Title</label>
                        <textarea
                            id="title"
                            value={post.title}
                            onChange={(e) => setPost(p => ({...p, title: e.target.value}))}
                            rows={1}
                            required
                            className="w-full text-3xl md:text-4xl lg:text-5xl font-extrabold font-serif p-0 border-none focus:ring-0 bg-transparent resize-none overflow-hidden"
                            placeholder="Post Title"
                            onInput={(e) => {
                                const target = e.currentTarget;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        />
                    </div>
                
                    <div className="relative">
                        <RichTextEditor
                            value={post.content || ''}
                            onChange={handleContentChange}
                        />
                        <div className="mt-2 flex justify-end text-xs text-slate-500 dark:text-slate-400 space-x-4">
                        <span>{editorStats.words} words</span>
                        <span>{editorStats.minutes} min read</span>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
            {isSettingsPanelOpen && (
                <motion.aside 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 350, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex-shrink-0 h-full overflow-y-auto bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 hide-scrollbar"
                >
                    <PostSidebar 
                        post={post} 
                        setPost={setPost} 
                        setIsImageModalOpen={setIsImageModalOpen} 
                        onRestore={handleRestoreRevisionClick}
                        onGenerateExcerpt={handleGenerateExcerpt}
                        isGeneratingExcerpt={isGeneratingExcerpt}
                    />
                </motion.aside>
            )}
            </AnimatePresence>
        </div>
    </motion.div>

    <AnimatePresence>
        {isImageModalOpen && (
            <ImageGenerationModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                initialPrompt={post.title || ''}
                onImageSelect={(imageUrl) => setPost(prev => ({...prev, imageUrl}))}
            />
        )}
        {isPreviewOpen && (
             <PostPreviewModal
                post={post}
                onClose={() => setIsPreviewOpen(false)}
            />
        )}
    </AnimatePresence>

    <ConfirmationModal
      isOpen={restoreTarget !== null}
      onClose={() => setRestoreTarget(null)}
      onConfirm={handleConfirmRestore}
      title="Restore Revision"
      message="Are you sure? This will replace your current content with the selected revision."
      confirmText="Restore"
      type="warning"
    />
    </>
  );
};

export default AdminPostFormPage;