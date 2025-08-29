import React, { useState } from 'react';
import { Post } from '../../types';
import { useData } from '../../hooks/useData';
import { ImageIcon, UploadCloudIcon, XIcon, UndoIcon, Wand2Icon } from '../icons';
import Accordion from './Accordion';
import SeoAnalysis from './SeoAnalysis';

interface PostSidebarProps {
  post: Partial<Post>;
  setPost: React.Dispatch<React.SetStateAction<Partial<Post>>>;
  setIsImageModalOpen: (isOpen: boolean) => void;
  onRestore: (content: string) => void;
  onGenerateExcerpt: () => void;
  isGeneratingExcerpt: boolean;
}

const PostSidebar: React.FC<PostSidebarProps> = ({ post, setPost, setIsImageModalOpen, onRestore, onGenerateExcerpt, isGeneratingExcerpt }) => {
  const { authors, categories, tags: allTags } = useData();
  const [tagInput, setTagInput] = useState('');
  const [isDraggingFeatured, setIsDraggingFeatured] = useState(false);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTagName = tagInput.trim();
      if (newTagName && !post.tags?.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
        let tagToAdd = allTags.find(t => t.name.toLowerCase() === newTagName.toLowerCase());
        if (!tagToAdd) {
          tagToAdd = { id: `new-${Date.now()}`, name: newTagName };
        }
        setPost(prev => ({ ...prev, tags: [...(prev.tags || []), tagToAdd] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setPost(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag.id !== tagId) }));
  };
  
  const handleFeaturedImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPost(prev => ({ ...prev, imageUrl: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleFeaturedImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFeatured(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFeaturedImageSelect(e.dataTransfer.files[0]);
    }
  };


  return (
    <div className="h-full">
        <Accordion title="Publish" defaultOpen={true}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                    <select id="status" name="status" value={post.status} onChange={(e) => setPost(p => ({...p, status: e.target.value as 'draft' | 'published'}))} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="featured" name="featured" type="checkbox" checked={post.featured} onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-slate-300 dark:border-slate-500 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="featured" className="font-medium text-slate-700 dark:text-slate-300">Featured Post</label>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Featured posts appear prominently on the homepage.</p>
                    </div>
                </div>
            </div>
        </Accordion>
        
        <Accordion title="Featured Image" defaultOpen={true}>
            <div className="space-y-4">
                {post.imageUrl ? (
                     <div className="relative group">
                        <img src={post.imageUrl} alt="Featured" className="w-full h-40 object-cover rounded-md bg-slate-100 dark:bg-slate-700" />
                        <button 
                            type="button" 
                            onClick={() => setPost(prev => ({...prev, imageUrl: ''}))}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div 
                        className={`relative flex justify-center items-center h-40 px-6 pt-5 pb-6 border-2 ${isDraggingFeatured ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'} border-dashed rounded-md transition-colors`}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingFeatured(true); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingFeatured(false); }}
                        onDrop={handleFeaturedImageDrop}
                    >
                        <div className="space-y-1 text-center">
                            <UploadCloudIcon className="mx-auto h-10 w-10 text-slate-400" />
                            <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => e.target.files && handleFeaturedImageSelect(e.target.files[0])}/>
                                </label>
                                <p className="pl-1">or drag & drop</p>
                            </div>
                        </div>
                        {isDraggingFeatured && <div className="absolute inset-0 bg-primary-500/10 backdrop-blur-sm rounded-md pointer-events-none"></div>}
                    </div>
                )}
                
                <button type="button" onClick={() => setIsImageModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <ImageIcon className="w-4 h-4"/>
                    Generate with AI
                </button>
            </div>
        </Accordion>
        
        <Accordion title="Excerpt">
             <div className="space-y-2">
                <textarea 
                    name="excerpt" 
                    id="excerpt" 
                    rows={5} 
                    value={post.excerpt} 
                    onChange={(e) => setPost(p => ({...p, excerpt: e.target.value}))} 
                    required 
                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"
                    placeholder="Write a short, compelling excerpt..."
                ></textarea>
                 <button 
                    type="button" 
                    onClick={onGenerateExcerpt}
                    disabled={isGeneratingExcerpt}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                 >
                    {isGeneratingExcerpt ? (
                         <div className="w-4 h-4 border-2 border-slate-400/50 border-t-slate-400 rounded-full animate-spin"></div>
                    ) : (
                        <Wand2Icon className="w-4 h-4" />
                    )}
                    {isGeneratingExcerpt ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
        </Accordion>

        <Accordion title="Organization">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Author</label>
                    <select id="author" name="author" value={post.author?.id} onChange={(e) => setPost(p => ({...p, author: authors.find(a => a.id === e.target.value)}))} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm">
                        {authors.map(author => <option key={author.id} value={author.id}>{author.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                    <div className="mt-1 space-y-2 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-md p-2 hide-scrollbar">
                        {categories.map(category => (
                            <div key={category.id} className="flex items-center">
                                <input 
                                    id={`category-${category.id}`} 
                                    name="category" 
                                    type="radio" 
                                    value={category.id}
                                    checked={post.category?.id === category.id} 
                                    onChange={(e) => setPost(p => ({...p, category: categories.find(c => c.id === e.target.value)}))}
                                    className="h-4 w-4 text-primary-600 border-slate-300 dark:border-slate-500 focus:ring-primary-500"
                                />
                                <label htmlFor={`category-${category.id}`} className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {category.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Accordion>

        <Accordion title="Tags">
            <div>
                <div className="mt-1 flex flex-wrap items-center gap-2 p-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                    {post.tags?.map(tag => (
                        <span key={tag.id} className="inline-flex items-center pl-2.5 pr-1 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200">
                            {tag.name}
                            <button type="button" onClick={() => handleRemoveTag(tag.id)} className="ml-1.5 flex-shrink-0 text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100">
                                <XIcon className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    <input type="text" id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder={post.tags?.length === 0 ? "Add tags..." : ""} className="flex-grow bg-transparent border-none focus:ring-0 p-1 text-sm" />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Press Enter or comma to add a tag.</p>
            </div>
        </Accordion>
        
        <Accordion title="Revision History">
            {post.history && post.history.length > 0 ? (
                <ul className="space-y-3 max-h-48 overflow-y-auto hide-scrollbar">
                    {post.history.map((rev, index) => (
                        <li key={index} className="flex items-center justify-between text-sm p-2 rounded-md bg-slate-100 dark:bg-slate-700/50">
                            <div>
                                <p className="font-medium text-slate-700 dark:text-slate-200">Revision {post.history!.length - index}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(rev.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => onRestore(rev.content)}
                                className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                title="Restore this version"
                            >
                                <UndoIcon className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No revisions saved yet. Revisions are saved when you update a post.</p>
            )}
        </Accordion>

        <Accordion title="SEO Analysis">
            <SeoAnalysis post={post} setPost={setPost} />
        </Accordion>
    </div>
  );
};

export default PostSidebar;