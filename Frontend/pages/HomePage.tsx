import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../hooks/useData';
import ArticleRow from '../components/ArticleRow';
import TopicsNavBar from '../components/TopicsNavBar';
import HomePageSidebar from '../components/HomePageSidebar';
import { ArrowLeftIcon, ArrowRightIcon, TrendingUpIcon } from '../components/icons';
import MainFeaturedPostCard from '../components/MainFeaturedPostCard';
import TrendingPostCard from '../components/TrendingPostCard';
import FeaturedCategoryCard from '../components/FeaturedCategoryCard';
import FeaturedAuthorCard from '../components/FeaturedAuthorCard';
import NewsletterSignup from '../components/NewsletterSignup';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
};

const POSTS_PER_PAGE = 6;

const HomePage: React.FC = () => {
    const { posts, authors, categories, tags, loading } = useData();
    const [currentPage, setCurrentPage] = useState(1);

    // Filter published posts
    const publishedPosts = useMemo(() => {
        return posts?.filter(post => post.status === 'published') || [];
    }, [posts]);

    const { mainFeaturedPost, trendingPosts, latestPosts } = useMemo(() => {
        if (!publishedPosts.length) {
            return { mainFeaturedPost: null, trendingPosts: [], latestPosts: [] };
        }

        const sortedByDate = [...publishedPosts].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        const featured = sortedByDate.filter(p => p.featured);
        const mainPost = featured[0] || sortedByDate[0];
        
        const trending = [...publishedPosts]
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 6);

        const latest = sortedByDate.filter(p => p.id !== mainPost?.id);

        return { mainFeaturedPost: mainPost, trendingPosts: trending, latestPosts: latest };
    }, [publishedPosts]);

    const authorsWithPostCounts = useMemo(() => {
        if (!authors?.length || !publishedPosts.length) return [];
        
        return authors.map(author => ({
            ...author,
            postCount: publishedPosts.filter(post => post.author.id === author.id).length
        })).sort((a, b) => b.postCount - a.postCount).slice(0, 3);
    }, [authors, publishedPosts]);

    const totalPages = Math.ceil(latestPosts.length / POSTS_PER_PAGE);
    const currentPosts = latestPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
        window.scrollTo(0, 0);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    // Show loading state
    if (loading.posts) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
                </div>
            </div>
        );
    }

    // Show empty state if no posts
    if (!publishedPosts.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Posts Yet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Check back later for new content!</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <TopicsNavBar categories={categories || []} />
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-16">
                <main className="lg:col-span-2 space-y-16">
                    {mainFeaturedPost && <MainFeaturedPostCard post={mainFeaturedPost} />}
                    
                    {/* Trending Section */}
                    {trendingPosts.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
                                <TrendingUpIcon className="w-6 h-6 mr-3 text-primary-500"/>
                                Trending on Inkwell
                            </h2>
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                            >
                                {trendingPosts.map((post, index) => (
                                    <TrendingPostCard key={post.id} post={post} index={index} />
                                ))}
                            </motion.div>
                        </section>
                    )}
                    
                    {/* Latest Posts Section */}
                    {latestPosts.length > 0 && (
                        <section>
                             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-t border-gray-200 dark:border-zinc-700 pt-12">
                                Latest Posts
                            </h2>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-12 divide-y divide-gray-200 dark:divide-zinc-700"
                            >
                                {currentPosts.map((post, index) => (
                                    <div key={post.id} className={index > 0 ? 'pt-12' : ''}>
                                        <ArticleRow post={post} />
                                    </div>
                                ))}
                            </motion.div>
                        </section>
                    )}
                    
                    {/* Pagination for Latest Posts */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-300 hover:bg-gray-50 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Previous
                            </button>
                            <span className="text-sm text-gray-500 dark:text-zinc-400">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-300 hover:bg-gray-50 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    )}
                    
                    {/* Discover More Section */}
                    {(categories?.length > 0 || authors?.length > 0) && (
                        <section className="space-y-12 border-t border-gray-200 dark:border-zinc-700 pt-12">
                            {categories?.length > 0 && (
                                <div>
                                     <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Discover More Topics</h2>
                                     <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {categories.slice(0, 4).map(category => (
                                            <FeaturedCategoryCard 
                                                key={category.id} 
                                                category={category} 
                                                postCount={publishedPosts.filter(p => p.category.id === category.id).length}
                                            />
                                        ))}
                                    </motion.div>
                                </div>
                            )}
                            {authorsWithPostCounts.length > 0 && (
                                <div>
                                     <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Featured Authors</h2>
                                     <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {authorsWithPostCounts.map(author => (
                                            <FeaturedAuthorCard key={author.id} author={author} />
                                        ))}
                                    </motion.div>
                                </div>
                            )}
                        </section>
                    )}

                    <section className="border-t border-gray-200 dark:border-zinc-700 pt-12">
                        <NewsletterSignup />
                    </section>

                </main>
                <aside className="hidden lg:block lg:col-span-1">
                    <HomePageSidebar 
                        featuredPosts={publishedPosts.filter(p => p.featured).slice(0, 4)}
                        recommendedTopics={tags?.slice(0, 8) || []}
                        authorsToFollow={authors?.slice(0, 3) || []}
                    />
                </aside>
            </div>
        </motion.div>
    );
};

export default HomePage;
