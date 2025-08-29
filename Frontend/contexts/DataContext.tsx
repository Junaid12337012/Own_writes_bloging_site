import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Category, Author, Tag, Comment, Page, Snippet, ContactMessage, Subscriber, User } from '../types';
import apiService from '../services/api';

interface SiteSettings {
  title: string;
  description: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
}

interface DataContextType {
  // Data
  posts: Post[];
  categories: Category[];
  authors: Author[];
  tags: Tag[];
  comments: Comment[];
  pages: Page[];
  snippets: Snippet[];
  contactMessages: ContactMessage[];
  subscribers: Subscriber[];
  users: User[];
  siteSettings: SiteSettings;
  
  // Loading states
  loading: {
    posts: boolean;
    categories: boolean;
    authors: boolean;
    tags: boolean;
    comments: boolean;
    pages: boolean;
    snippets: boolean;
    contactMessages: boolean;
    subscribers: boolean;
    users: boolean;
  };
  
  // Actions
  refreshPosts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshAuthors: () => Promise<void>;
  refreshTags: () => Promise<void>;
  refreshComments: () => Promise<void>;
  refreshPages: () => Promise<void>;
  refreshContactMessages: () => Promise<void>;
  refreshSubscribers: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  
  // CRUD operations
  createPost: (postData: any) => Promise<boolean>;
  updatePost: (id: string, postData: any) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  likePost: (id: string) => Promise<boolean>;
  
  createCategory: (categoryData: any) => Promise<boolean>;
  updateCategory: (id: string, categoryData: any) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  createAuthor: (authorData: any) => Promise<boolean>;
  updateAuthor: (id: string, authorData: any) => Promise<boolean>;
  deleteAuthor: (id: string) => Promise<boolean>;
  
  createComment: (commentData: any) => Promise<boolean>;
  updateCommentStatus: (id: string, status: string) => Promise<boolean>;
  deleteComment: (id: string) => Promise<boolean>;
  
  submitContactForm: (formData: { name: string; email: string; message: string }) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;
  
  subscribe: (email: string) => Promise<boolean>;
  unsubscribe: (email: string) => Promise<boolean>;
  deleteSubscriber: (id: string) => Promise<boolean>;
  
  createPage: (pageData: any) => Promise<boolean>;
  updatePage: (id: string, pageData: any) => Promise<boolean>;
  deletePage: (id: string) => Promise<boolean>;
  
  createSnippet: (snippetData: any) => Promise<boolean>;
  updateSnippet: (id: string, snippetData: any) => Promise<boolean>;
  deleteSnippet: (id: string) => Promise<boolean>;
  
  updateUser: (userData: User) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([
    {
      id: '1',
      name: 'Call to Action',
      description: 'Engaging CTA button with modern styling',
      icon: 'MousePointerClickIcon',
      content: '<div style="text-align: center; margin: 2rem 0; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;"><h3 style="margin: 0 0 1rem 0; font-size: 1.5rem; font-weight: bold;">Ready to Get Started?</h3><p style="margin: 0 0 1.5rem 0; opacity: 0.9;">Join thousands of users who are already transforming their workflow.</p><a href="#" style="display: inline-block; background: white; color: #667eea; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s;">Get Started Today</a></div>'
    },
    {
      id: '2',
      name: 'Info Box',
      description: 'Highlighted information box with icon',
      icon: 'InfoIcon',
      content: '<div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0;"><div style="display: flex; align-items: flex-start; gap: 12px;"><div style="background: #0ea5e9; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0;">i</div><div><h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-weight: 600;">Pro Tip</h4><p style="margin: 0; color: #075985;">This is important information that your readers should pay attention to. Use this for tips, warnings, or key insights.</p></div></div></div>'
    },
    {
      id: '3',
      name: 'Quote Block',
      description: 'Stylized quote with author attribution',
      icon: 'QuoteIcon',
      content: '<div style="background: #fafafa; border-radius: 12px; padding: 2rem; margin: 2rem 0; position: relative;"><div style="font-size: 4rem; color: #e5e7eb; position: absolute; top: 1rem; left: 1.5rem; line-height: 1;">"</div><blockquote style="margin: 0; padding-left: 3rem; font-size: 1.25rem; font-style: italic; color: #374151; line-height: 1.6;">"The best way to predict the future is to create it."</blockquote><div style="margin-top: 1.5rem; padding-left: 3rem;"><cite style="font-weight: 600; color: #6b7280;">— Peter Drucker</cite></div></div>'
    },
    {
      id: '4',
      name: 'Feature Grid',
      description: '3-column feature showcase grid',
      icon: 'GridIcon',
      content: '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0;"><div style="text-align: center; padding: 1.5rem; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0;"><div style="background: #3b82f6; color: white; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 24px;">⚡</div><h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 600; color: #1e293b;">Fast Performance</h3><p style="margin: 0; color: #64748b; font-size: 0.9rem;">Lightning-fast loading times and optimized performance.</p></div><div style="text-align: center; padding: 1.5rem; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0;"><div style="background: #10b981; color: white; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 24px;">🔒</div><h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 600; color: #1e293b;">Secure</h3><p style="margin: 0; color: #64748b; font-size: 0.9rem;">Enterprise-grade security with end-to-end encryption.</p></div><div style="text-align: center; padding: 1.5rem; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0;"><div style="background: #f59e0b; color: white; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 24px;">🎯</div><h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 600; color: #1e293b;">Targeted</h3><p style="margin: 0; color: #64748b; font-size: 0.9rem;">Precise targeting and analytics for better results.</p></div></div>'
    },
    {
      id: '5',
      name: 'Code Snippet',
      description: 'Syntax-highlighted code block',
      icon: 'Code2Icon',
      content: '<div style="background: #1e293b; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; overflow-x: auto;"><div style="display: flex; align-items: center; justify-content: between; margin-bottom: 1rem;"><div style="display: flex; gap: 6px;"><div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></div><div style="width: 12px; height: 12px; border-radius: 50%; background: #f59e0b;"></div><div style="width: 12px; height: 12px; border-radius: 50%; background: #10b981;"></div></div></div><pre style="margin: 0; color: #e2e8f0; font-family: \'Fira Code\', \'Monaco\', monospace; font-size: 14px; line-height: 1.5;"><code>function createAwesomeContent() {\n  const ideas = generateIdeas();\n  const content = ideas.map(idea => {\n    return writeEngagingPost(idea);\n  });\n  \n  return content.filter(post => post.isAwesome);\n}</code></pre></div>'
    },
    {
      id: '6',
      name: 'Newsletter Signup',
      description: 'Email subscription form with gradient background',
      icon: 'MailIcon',
      content: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 3rem 2rem; margin: 3rem 0; text-align: center; color: white;"><h3 style="margin: 0 0 1rem 0; font-size: 2rem; font-weight: bold;">Stay Updated</h3><p style="margin: 0 0 2rem 0; font-size: 1.1rem; opacity: 0.9;">Get the latest insights and updates delivered straight to your inbox.</p><div style="display: flex; gap: 1rem; max-width: 400px; margin: 0 auto; flex-wrap: wrap;"><input type="email" placeholder="Enter your email" style="flex: 1; min-width: 200px; padding: 12px 16px; border: none; border-radius: 8px; font-size: 16px;"><button style="background: rgba(255,255,255,0.2); color: white; border: 2px solid white; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Subscribe</button></div></div>'
    },
    {
      id: '7',
      name: 'Warning Alert',
      description: 'Important warning or caution message',
      icon: 'AlertTriangleIcon',
      content: '<div style="background: #fef3cd; border: 1px solid #f6cc47; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;"><div style="display: flex; align-items: flex-start; gap: 12px;"><div style="background: #f59e0b; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0;">!</div><div><h4 style="margin: 0 0 8px 0; color: #92400e; font-weight: 600;">Important Warning</h4><p style="margin: 0; color: #a16207;">Please read this carefully before proceeding. This action cannot be undone and may have significant consequences.</p></div></div></div>'
    },
    {
      id: '8',
      name: 'Success Message',
      description: 'Positive confirmation or success alert',
      icon: 'CheckCircleIcon',
      content: '<div style="background: #d1fae5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;"><div style="display: flex; align-items: flex-start; gap: 12px;"><div style="background: #10b981; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0;">✓</div><div><h4 style="margin: 0 0 8px 0; color: #065f46; font-weight: 600;">Success!</h4><p style="margin: 0; color: #047857;">Your action has been completed successfully. Everything is working as expected.</p></div></div></div>'
    },
    {
      id: '9',
      name: 'Image Gallery',
      description: '2x2 responsive image grid layout',
      icon: 'ImageIcon',
      content: '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0;"><div style="aspect-ratio: 1; background: linear-gradient(45deg, #f3f4f6, #e5e7eb); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 3rem;">📷</div><div style="aspect-ratio: 1; background: linear-gradient(45deg, #e5e7eb, #d1d5db); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 3rem;">🖼️</div><div style="aspect-ratio: 1; background: linear-gradient(45deg, #d1d5db, #9ca3af); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 3rem;">🎨</div><div style="aspect-ratio: 1; background: linear-gradient(45deg, #9ca3af, #6b7280); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">📸</div></div>'
    },
    {
      id: '10',
      name: 'Pricing Card',
      description: 'Professional pricing plan card',
      icon: 'CreditCardIcon',
      content: '<div style="background: white; border: 2px solid #e5e7eb; border-radius: 16px; padding: 2rem; margin: 2rem 0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-width: 300px; margin-left: auto; margin-right: auto;"><div style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 20px; display: inline-block; font-size: 0.875rem; font-weight: 600; margin-bottom: 1.5rem;">POPULAR</div><h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: bold; color: #1f2937;">Pro Plan</h3><div style="margin: 1rem 0;"><span style="font-size: 3rem; font-weight: bold; color: #1f2937;">$29</span><span style="color: #6b7280;">/month</span></div><ul style="list-style: none; padding: 0; margin: 1.5rem 0; text-align: left;"><li style="padding: 0.5rem 0; color: #374151;">✓ Unlimited projects</li><li style="padding: 0.5rem 0; color: #374151;">✓ Priority support</li><li style="padding: 0.5rem 0; color: #374151;">✓ Advanced analytics</li><li style="padding: 0.5rem 0; color: #374151;">✓ Team collaboration</li></ul><button style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; width: 100%; cursor: pointer; font-size: 1rem;">Choose Plan</button></div>'
    }
  ]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: 'OwnWrites',
    description: 'A modern blogging platform for creators and readers',
    logoLightUrl: '',
    logoDarkUrl: '',
    twitterUrl: 'https://twitter.com',
    githubUrl: 'https://github.com'
  });

  const [loading, setLoading] = useState({
    posts: false,
    categories: false,
    authors: false,
    tags: false,
    comments: false,
    pages: false,
    snippets: false,
    contactMessages: false,
    subscribers: false,
    users: false
  });

  // Refresh functions
  const refreshPosts = async () => {
    setLoading(prev => ({ ...prev, posts: true }));
    try {
      const response = await apiService.getPosts();
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  };

  const refreshCategories = async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const response = await apiService.getCategories();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const refreshAuthors = async () => {
    setLoading(prev => ({ ...prev, authors: true }));
    try {
      const response = await apiService.getAuthors();
      if (response.data) {
        setAuthors(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    } finally {
      setLoading(prev => ({ ...prev, authors: false }));
    }
  };

  const refreshTags = async () => {
    setLoading(prev => ({ ...prev, tags: true }));
    try {
      const response = await apiService.getTags();
      if (response.data) {
        setTags(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(prev => ({ ...prev, tags: false }));
    }
  };

  const refreshComments = async () => {
    setLoading(prev => ({ ...prev, comments: true }));
    try {
      const response = await apiService.getAllComments();
      if (response.data) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(prev => ({ ...prev, comments: false }));
    }
  };

  const refreshPages = async () => {
    setLoading(prev => ({ ...prev, pages: true }));
    try {
      const response = await apiService.getPages();
      if (response.data) {
        setPages(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(prev => ({ ...prev, pages: false }));
    }
  };

  const refreshContactMessages = async () => {
    setLoading(prev => ({ ...prev, contactMessages: true }));
    try {
      const response = await apiService.getContactMessages();
      if (response.data) {
        setContactMessages(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch contact messages:', error);
    } finally {
      setLoading(prev => ({ ...prev, contactMessages: false }));
    }
  };

  const refreshSubscribers = async () => {
    setLoading(prev => ({ ...prev, subscribers: true }));
    try {
      const response = await apiService.getSubscribers();
      if (response.data) {
        setSubscribers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(prev => ({ ...prev, subscribers: false }));
    }
  };

  const refreshUsers = async () => {
    // Only fetch users if user is authenticated and is admin
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
      console.log('No authentication token, skipping users fetch');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      if (!parsedUser.isAdmin) {
        console.log('User is not admin, skipping users fetch');
        return;
      }
    } catch (error) {
      console.log('Failed to parse user data, skipping users fetch');
      return;
    }

    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await apiService.getUsers();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // CRUD operations
  const createPost = async (postData: any): Promise<boolean> => {
    try {
      const response = await apiService.createPost(postData);
      if (response.data) {
        await refreshPosts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create post:', error);
      return false;
    }
  };

  const updatePost = async (id: string, postData: any): Promise<boolean> => {
    try {
      const response = await apiService.updatePost(id, postData);
      if (response.data) {
        await refreshPosts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update post:', error);
      return false;
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.deletePost(id);
      if (response.data) {
        await refreshPosts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete post:', error);
      return false;
    }
  };

  const likePost = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.likePost(id);
      if (response.data) {
        // Update the post likes locally
        setPosts(prev => prev.map(post => 
          post.id === id ? { ...post, likes: post.likes + 1 } : post
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to like post:', error);
      return false;
    }
  };

  const createCategory = async (categoryData: any): Promise<boolean> => {
    try {
      const response = await apiService.createCategory(categoryData);
      if (response.data) {
        await refreshCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create category:', error);
      return false;
    }
  };

  const updateCategory = async (id: string, categoryData: any): Promise<boolean> => {
    try {
      const response = await apiService.updateCategory(id, categoryData);
      if (response.data) {
        await refreshCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update category:', error);
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.deleteCategory(id);
      if (response.data) {
        await refreshCategories();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      // Check if it's a dependency error
      if (error.response?.data?.code === 'CATEGORY_HAS_POSTS') {
        throw new Error(error.response.data.error);
      }
      return false;
    }
  };

  const createAuthor = async (authorData: any): Promise<boolean> => {
    try {
      const response = await apiService.createAuthor(authorData);
      if (response.data) {
        await refreshAuthors();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create author:', error);
      return false;
    }
  };

  const updateAuthor = async (id: string, authorData: any): Promise<boolean> => {
    try {
      const response = await apiService.updateAuthor(id, authorData);
      if (response.data) {
        await refreshAuthors();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update author:', error);
      return false;
    }
  };

  const deleteAuthor = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.deleteAuthor(id);
      if (response.data) {
        await refreshAuthors();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Failed to delete author:', error);
      // Check if it's a dependency error
      if (error.response?.data?.code === 'AUTHOR_HAS_POSTS') {
        throw new Error(error.response.data.error);
      }
      return false;
    }
  };

  const createComment = async (commentData: any): Promise<boolean> => {
    try {
      const response = await apiService.createComment(commentData);
      if (response.data) {
        await refreshComments();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create comment:', error);
      return false;
    }
  };

  const updateCommentStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const response = await apiService.updateCommentStatus(id, status);
      if (response.data) {
        await refreshComments();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update comment status:', error);
      return false;
    }
  };

  const deleteComment = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.deleteComment(id);
      if (response.data) {
        await refreshComments();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete comment:', error);
      return false;
    }
  };

  const submitContactForm = async (formData: { name: string; email: string; message: string }): Promise<boolean> => {
    try {
      const response = await apiService.submitContactForm(formData);
      if (response.data) {
        return true;
      }
      if (response.error) {
        console.error('Contact form validation error:', response.error);
        throw new Error(response.error);
      }
      return false;
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      throw error;
    }
  };

  const deleteContactMessage = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.deleteContactMessage(id);
      if (response.data) {
        await refreshContactMessages();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete contact message:', error);
      return false;
    }
  };

  const subscribe = async (email: string): Promise<boolean> => {
    try {
      const response = await apiService.subscribe(email);
      if (response.data) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return false;
    }
  };

  const unsubscribe = async (email: string): Promise<boolean> => {
    try {
      const response = await apiService.unsubscribe(email);
      if (response.data) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  };

  const deleteSubscriber = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.deleteSubscriber(id);
      if (response.data) {
        await refreshSubscribers();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
      return false;
    }
  };

  const createPage = async (pageData: any): Promise<boolean> => {
    try {
      const response = await apiService.createPage(pageData);
      if (response.data) {
        await refreshPages();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create page:', error);
      return false;
    }
  };

  const updatePage = async (id: string, pageData: any): Promise<boolean> => {
    try {
      const response = await apiService.updatePage(id, pageData);
      if (response.data) {
        await refreshPages();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update page:', error);
      return false;
    }
  };

  const deletePage = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.deletePage(id);
      if (response.data) {
        await refreshPages();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete page:', error);
      return false;
    }
  };

  const createSnippet = async (snippetData: any): Promise<boolean> => {
    try {
      const newSnippet = {
        ...snippetData,
        id: Date.now().toString() // Simple ID generation for demo
      };
      setSnippets(prev => [...prev, newSnippet]);
      return true;
    } catch (error) {
      console.error('Failed to create snippet:', error);
      return false;
    }
  };

  const updateSnippet = async (id: string, snippetData: any): Promise<boolean> => {
    try {
      setSnippets(prev => prev.map(snippet => 
        snippet.id === id ? { ...snippet, ...snippetData } : snippet
      ));
      return true;
    } catch (error) {
      console.error('Failed to update snippet:', error);
      return false;
    }
  };

  const deleteSnippet = async (id: string): Promise<boolean> => {
    try {
      setSnippets(prev => prev.filter(snippet => snippet.id !== id));
      return true;
    } catch (error) {
      console.error('Failed to delete snippet:', error);
      return false;
    }
  };

  const updateUser = async (userData: User): Promise<boolean> => {
    try {
      const response = await apiService.updateUser(userData.id, userData);
      if (response.data) {
        await refreshUsers();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update user:', error);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.deleteUser(id);
      if (response.data) {
        await refreshUsers();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  };

  // Update site settings function
  const updateSiteSettings = async (newSettings: SiteSettings) => {
    try {
      // Update local state immediately for better UX
      setSiteSettings(newSettings);
      
      // Save to database
      const response = await apiService.updateSiteSettings(newSettings);
      if (response.error) {
        console.error('Failed to save settings to database:', response.error);
        // Optionally revert local changes if save fails
      } else {
        console.log('Site settings saved successfully');
      }
    } catch (error) {
      console.error('Error updating site settings:', error);
    }
  };

  // Load site settings from database
  const loadSiteSettings = async () => {
    try {
      const response = await apiService.getSiteSettings();
      if (response.data) {
        const data = response.data as any;
        setSiteSettings({
          title: data.title,
          description: data.description,
          logoLightUrl: data.logo_light_url,
          logoDarkUrl: data.logo_dark_url,
          twitterUrl: data.twitter_url,
          githubUrl: data.github_url
        });
      }
    } catch (error) {
      console.error('Failed to load site settings:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    loadSiteSettings();
    refreshPosts();
    refreshCategories();
    refreshAuthors();
    refreshTags();
    refreshPages();
    refreshUsers();
  }, []);

  const value: DataContextType = {
    // Data
    posts,
    categories,
    authors,
    tags,
    comments,
    pages,
    snippets,
    contactMessages,
    subscribers,
    users,
    siteSettings,
    
    // Loading states
    loading,
    
    // Refresh functions
    refreshPosts,
    refreshCategories,
    refreshAuthors,
    refreshTags,
    refreshComments,
    refreshPages,
    refreshContactMessages,
    refreshSubscribers,
    refreshUsers,
    
    // CRUD operations
    createPost,
    updatePost,
    deletePost,
    likePost,
    createCategory,
    updateCategory,
    deleteCategory,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    createComment,
    updateCommentStatus,
    deleteComment,
    submitContactForm,
    deleteContactMessage,
    subscribe,
    unsubscribe,
    deleteSubscriber,
    createPage,
    updatePage,
    deletePage,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    updateUser,
    deleteUser,
    updateSiteSettings
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};