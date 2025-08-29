import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as motionTyped, useScroll } from 'framer-motion';
import { MessageCircleIcon, BookmarkIcon, UserIcon } from '../components/icons';
import { useSavedPosts } from '../hooks/useSavedPosts';
import AiSummary from '../components/AiSummary';
import AskTheArticle from '../components/AskTheArticle';
import TableOfContents, { Heading } from '../components/TableOfContents';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import BlogPostCard from '../components/BlogPostCard';
import AiQuizGenerator from '../components/AiQuizGenerator';
import ReadingProgressTracker from '../components/ReadingProgressTracker';
import SocialShareButtons from '../components/SocialShareButtons';
import BookmarkButton from '../components/BookmarkButton';
import RelatedPosts from '../components/RelatedPosts';

const motion = motionTyped as any;

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { posts, comments: allComments, createComment, siteSettings, loading } = useData();
  const { user } = useAuth();
  const { isSaved, toggleSaved } = useSavedPosts();
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const contentRef = useRef<HTMLDivElement>(null);

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Filter posts - show drafts to admin users, published to everyone
  const visiblePosts = useMemo(() => {
    if (!posts) return [];
    // Admin users can see all posts (including drafts)
    if (user?.isAdmin) {
      return posts;
    }
    // Regular users only see published posts
    return posts.filter(post => post.status === 'published');
  }, [posts, user?.isAdmin]);

  const post = visiblePosts.find(p => p.id === id);

  useEffect(() => {
    const originalTitle = document.title;
    if (post && siteSettings) {
        document.title = `${post.title} | ${siteSettings.title}`;
    }
    // Reset title on unmount
    return () => {
        document.title = originalTitle;
    };
  }, [post, siteSettings?.title]);

  const { processedContent, headings } = useMemo(() => {
    if (!post) return { processedContent: '', headings: [] };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    const foundHeadings: Heading[] = [];
    
    tempDiv.querySelectorAll('h2, h3').forEach((header, index) => {
      const text = header.textContent || '';
      const id = slugify(text) || `heading-${index}`;
      header.id = id;
      foundHeadings.push({
        id,
        text,
        level: header.tagName === 'H2' ? 2 : 3,
      });
    });

    return { processedContent: tempDiv.innerHTML, headings: foundHeadings };
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post || !visiblePosts.length) return [];
    // For related posts, only show published posts regardless of user role
    const publishedOnly = visiblePosts.filter(p => p.status === 'published');
    const postsInCategory = publishedOnly
        .filter(p => p.category.id === post.category.id && p.id !== post.id)
        .slice(0, 3);
    if (postsInCategory.length >= 3) return postsInCategory;
    const recentPosts = publishedOnly
        .filter(p => !postsInCategory.some(selected => selected.id === p.id) && p.id !== post.id)
        .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    return [...postsInCategory, ...recentPosts].slice(0, 3);
  }, [post, visiblePosts]);

  useEffect(() => {
    const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (headingElements.length === 0) return;
    
    const intersectingIds = new Set<string>();

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    intersectingIds.add(entry.target.id);
                } else {
                    intersectingIds.delete(entry.target.id);
                }
            });

            let newActiveId: string | null = null;
            // Find the LAST heading in document order that is intersecting.
            // This means it's the one lowest on the page that's still in our observation area.
            for (let i = headings.length - 1; i >= 0; i--) {
                if (intersectingIds.has(headings[i].id)) {
                    newActiveId = headings[i].id;
                    break;
                }
            }
            
            setActiveHeadingId(newActiveId);
        },
        {
            // The observation area starts 80px from the top (to account for the sticky header)
            // and ends 40% from the bottom of the viewport. This targets the content
            // in the upper-middle part of the screen.
            rootMargin: `-80px 0px -40% 0px`,
        }
    );

    headingElements.forEach(el => observer.observe(el));

    return () => {
        headingElements.forEach(el => observer.unobserve(el));
    };
  }, [headings]);

  // Show loading state
  if (loading.posts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-20">Post not found. <Link to="/" className="text-primary-600 hover:underline">Go back home</Link></div>;
  }

  const { author, title, publishedDate, readingTime, imageUrl, excerpt, tags, likes } = post;
  const isPostSaved = isSaved(post.id);
  const postComments = allComments?.filter(c => c.postId === post.id && c.status === 'approved') || [];
  const postCommentCount = postComments.length;
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) {
        if (!user) setSubmissionMessage("You must be logged in to comment.");
        return;
    }
    setIsSubmitting(true);
    setSubmissionMessage('');
    
    setTimeout(() => {
        createComment({
            postId: post.id,
            authorName: user.name,
            authorAvatarUrl: user.avatarUrl,
            text: commentText,
            status: 'pending',
        });
        setIsSubmitting(false);
        setCommentText('');
        setSubmissionMessage('Success! Your comment has been submitted for moderation.');
    }, 500);
  };
  
  const SidebarAction: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    onClick?: () => void;
    active?: boolean;
  }> = ({ icon, label, value, onClick, active = false }) => (
    <button
        onClick={onClick}
        className={`group flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
            active ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-zinc-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
        }`}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3 text-sm font-medium">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${active ? 'text-primary-600 dark:text-primary-300' : 'text-gray-500 dark:text-zinc-400 group-hover:text-gray-800 dark:group-hover:text-zinc-100'}`}>{value}</span>
    </button>
  );

  const MobileActionButton: React.FC<{
    icon: React.ReactNode;
    ariaLabel: string;
    onClick?: () => void;
    active?: boolean;
  }> = ({ icon, ariaLabel, onClick, active = false }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-3 rounded-full transition-colors ${
        active ? 'text-primary-500 bg-primary-100 dark:text-primary-300 dark:bg-primary-900/50' : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Reading Progress Tracker */}
      <ReadingProgressTracker targetRef={contentRef} />

      {/* Hero Header */}
      <header className="max-w-4xl mx-auto text-center py-12 px-4">
        <Link to={`/category/${post.category.id}`} className="text-sm font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:underline">
          {post.category.name}
        </Link>
        {post.status === 'draft' && (
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              📝 Draft Preview
            </span>
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-extrabold font-serif text-gray-900 dark:text-white leading-tight mt-4">
          {title}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-zinc-400">{excerpt}</p>
        <div className="mt-8 flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-gray-500 dark:text-zinc-400">
          <Link to={`/author/${author.id}`} className="flex items-center space-x-2 hover:underline text-gray-800 dark:text-zinc-200 font-semibold">
            <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full" />
            <span>{author.name}</span>
          </Link>
          <span className="text-gray-300 dark:text-zinc-600 hidden sm:inline">&bull;</span>
          <time dateTime={publishedDate}>{new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
           <span className="text-gray-300 dark:text-zinc-600 hidden sm:inline">&bull;</span>
          <span>{readingTime} min read</span>
        </div>
        
        {/* Social Share and Bookmark Actions */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <SocialShareButtons 
            url={window.location.href}
            title={title}
            description={excerpt}
          />
          <BookmarkButton post={post} showText className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg" />
        </div>
      </header>
      
      {/* Featured Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <img src={imageUrl} alt={title} className="w-full h-auto max-h-[70vh] object-cover rounded-2xl shadow-2xl shadow-gray-300/50 dark:shadow-black/30" />
      </div>


      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* Left Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              <div className="p-4 bg-gray-100 dark:bg-zinc-800/60 rounded-2xl border dark:border-zinc-700/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-3">Author</h4>
                <div className="flex items-center gap-4">
                  <Link to={`/author/${author.id}`}>
                    <img src={author.avatarUrl} alt={author.name} className="w-12 h-12 rounded-full" />
                  </Link>
                  <div>
                    <Link to={`/author/${author.id}`} className="hover:underline">
                      <h4 className="font-bold text-gray-900 dark:text-white">{author.name}</h4>
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">{author.bio?.substring(0,40)}...</p>
                  </div>
                </div>
              </div>

              <div className="p-2 bg-gray-100 dark:bg-zinc-800/60 rounded-2xl border dark:border-zinc-700/50 space-y-1">
                <SidebarAction icon={<MessageCircleIcon className="w-5 h-5"/>} label="Comments" value={postCommentCount} />
                <SidebarAction 
                  icon={<BookmarkIcon className="w-5 h-5" filled={isPostSaved}/>} 
                  label={isPostSaved ? 'Saved' : 'Save'} 
                  value=""
                  onClick={() => toggleSaved(post.id)}
                  active={isPostSaved}
                />
              </div>

            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
             <div className="lg:hidden mb-12">
                {headings.length >= 3 && <TableOfContents headings={headings} activeId={activeHeadingId} />}
              </div>
            <article ref={contentRef}>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none mx-auto text-gray-700 dark:text-zinc-300 font-serif leading-relaxed"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
              <div className="mt-12 flex flex-wrap gap-2">
                {tags?.map(tag => (
                  <Link 
                      key={tag.id} 
                      to={`/tag/${tag.id}`}
                      className="inline-block bg-gray-100 dark:bg-zinc-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                  >
                      #{tag.name}
                  </Link>
                ))}
              </div>
            </article>

            <AiSummary content={post.content} />
            <AskTheArticle content={post.content} />
            <AiQuizGenerator content={post.content} />
            
            <section className="mt-24">
              <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-white mb-8">Comments ({postCommentCount})</h2>
              <div className="space-y-8 bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-lg border dark:border-zinc-700">
                {postComments.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <img src={comment.authorAvatarUrl} alt={comment.authorName} className="w-12 h-12 rounded-full"/>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-800 dark:text-zinc-100">{comment.authorName}</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{comment.timestamp}</p>
                      </div>
                      <p className="mt-1 text-gray-600 dark:text-zinc-300">{comment.text}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-8 border-t border-gray-200 dark:border-zinc-700">
                      <form onSubmit={handleCommentSubmit} className="flex items-start space-x-4">
                          {user ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0 mt-1" />
                           ) : (
                            <div className="w-10 h-10 rounded-full flex-shrink-0 mt-1 bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                            </div>
                           )}
                          <div className="flex-1">
                              <textarea 
                                  rows={4} 
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  disabled={!user || isSubmitting}
                                  className="w-full p-4 border rounded-lg bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-600 focus:ring-primary-500 focus:border-primary-500 transition disabled:opacity-50" 
                                  placeholder={user ? "Join the discussion..." : "Please log in to leave a comment."}
                              ></textarea>
                              <div className="mt-4 flex items-center justify-between">
                                   <button 
                                      type="submit"
                                      disabled={!user || isSubmitting || !commentText.trim()}
                                      className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 disabled:bg-slate-400 dark:disabled:bg-zinc-600"
                                  >
                                    {isSubmitting ? "Submitting..." : "Post Comment"}
                                  </button>
                                  {submissionMessage && <p className="text-sm text-green-600 dark:text-green-400">{submissionMessage}</p>}
                              </div>
                              {!user && <p className="text-sm mt-2 text-gray-500">Please <span className="font-semibold text-primary-600 dark:text-primary-400">sign in</span> to join the conversation.</p>}
                          </div>
                      </form>
                  </div>
              </div>
            </section>
          </main>
          
           {/* Right Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              {headings.length >= 3 && <TableOfContents headings={headings} activeId={activeHeadingId} />}
              
              {/* Related Posts in Sidebar */}
              <RelatedPosts 
                currentPost={post}
                allPosts={posts}
                maxPosts={3}
              />
            </div>
          </aside>
        </div>
      </div>
      
      {/* Related Posts Section - Mobile Only */}
      <div className="lg:hidden">
        {relatedPosts.length > 0 && (
          <section className="mt-16 py-24 bg-gray-100 dark:bg-zinc-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-white mb-8 text-center">Continue Reading</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {relatedPosts.map(relatedPost => (
                        <BlogPostCard key={relatedPost.id} post={relatedPost} />
                    ))}
                </div>
              </div>
          </section>
        )}
      </div>

    </motion.div>
  );
};

export default BlogPostPage;