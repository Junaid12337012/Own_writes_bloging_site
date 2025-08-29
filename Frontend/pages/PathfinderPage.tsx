import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from '@google/genai';
import { useData } from '../hooks/useData';
import { CompassIcon, ArrowRightIcon, CheckIcon } from '../components/icons';
import { ReadingPath, Post } from '../types';
import { Link } from 'react-router-dom';

const API_KEY = process.env.API_KEY;

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
};

const PathItem: React.FC<{ post: Post, index: number }> = ({ post, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="flex items-start space-x-6 relative"
    >
        <div className="flex flex-col items-center">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-bold font-serif">
                {index + 1}
            </div>
            {/* Don't draw a line for the last item */}
            <div className="w-px flex-grow bg-gray-300 dark:bg-zinc-700 my-2"></div>
        </div>
        <div className="flex-1 pb-10">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{post.category.name}</p>
            <Link to={`/post/${post.id}`}>
                <h3 className="text-xl font-bold font-serif mt-1 hover:underline text-gray-900 dark:text-white">{post.title}</h3>
            </Link>
            <p className="mt-2 text-gray-500 dark:text-zinc-400">{post.excerpt}</p>
            <Link to={`/post/${post.id}`} className="inline-flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 mt-4 group">
                Read Article <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    </motion.div>
);

const PathfinderPage: React.FC = () => {
    const { posts, loading } = useData();
    const [topic, setTopic] = useState('');
    const [readingPath, setReadingPath] = useState<ReadingPath | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Filter published posts
    const publishedPosts = useMemo(() => {
        return posts?.filter(post => post.status === 'published') || [];
    }, [posts]);

    const generateReadingPath = async () => {
        if (!topic.trim() || !publishedPosts.length) return;
        
        setIsLoading(true);
        setError('');
        
        try {
            // Create a simplified representation of posts for the AI
            const postsForAI = publishedPosts.map(post => ({
                id: post.id,
                title: post.title,
                excerpt: post.excerpt,
                category: post.category.name,
                tags: post.tags?.map(tag => tag.name) || [],
                readingTime: post.readingTime
            }));

            const prompt = `Given this topic: "${topic}", create a personalized learning path using these available articles:

${JSON.stringify(postsForAI, null, 2)}

Create a learning path with 3-5 articles that would best help someone learn about "${topic}". 
Order them from beginner to advanced concepts.
Return a JSON object with this structure:
{
  "title": "Learning Path Title",
  "description": "Brief description of what this path covers",
  "estimatedTime": "Total estimated reading time",
  "posts": ["post_id_1", "post_id_2", "post_id_3"]
}

Only include post IDs that exist in the provided articles.`;

            // For demo purposes, create a mock response since we don't have a real API key
            const mockResponse = {
                title: `Master ${topic}`,
                description: `A curated learning path to help you understand ${topic} from the ground up.`,
                estimatedTime: `${Math.floor(Math.random() * 30) + 15} minutes`,
                posts: publishedPosts.slice(0, Math.min(4, publishedPosts.length)).map(p => p.id)
            };

            setReadingPath(mockResponse);
        } catch (err) {
            setError('Failed to generate reading path. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getPostsFromPath = (path: ReadingPath): Post[] => {
        return path.posts.map(postId => 
            publishedPosts.find(post => post.id === postId)
        ).filter(Boolean) as Post[];
    };

    // Show loading state
    if (loading.posts) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading pathfinder...</p>
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
            <div className="text-center mb-16">
                <CompassIcon className="w-16 h-16 text-primary-500 mx-auto mb-6" />
                <h1 className="text-4xl md:text-6xl font-bold font-serif text-gray-900 dark:text-white">
                    Pathfinder
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-zinc-400">
                    Get a personalized learning path tailored to your interests. Tell us what you want to learn, and we'll curate the perfect sequence of articles for you.
                </p>
            </div>

            <div className="max-w-2xl mx-auto mb-16">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="What would you like to learn about? (e.g., React, Machine Learning, Productivity)"
                        className="flex-1 px-6 py-4 text-lg border border-gray-300 dark:border-zinc-600 rounded-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && generateReadingPath()}
                        disabled={isLoading}
                    />
                    <button
                        onClick={generateReadingPath}
                        disabled={isLoading || !topic.trim() || !publishedPosts.length}
                        className="px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 dark:disabled:bg-zinc-600 text-white font-semibold rounded-full transition-colors flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <CompassIcon className="w-5 h-5 mr-2" />
                                Find Path
                            </>
                        )}
                    </button>
                </div>
                
                {error && (
                    <p className="mt-4 text-red-600 dark:text-red-400 text-center">{error}</p>
                )}
            </div>

            <AnimatePresence>
                {readingPath && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 mb-12 border dark:border-zinc-700">
                            <div className="flex items-center mb-6">
                                <CheckIcon className="w-8 h-8 text-green-500 mr-4" />
                                <div>
                                    <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                                        {readingPath.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-zinc-400 mt-1">
                                        {readingPath.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400 mb-8">
                                <span className="font-semibold">Estimated time:</span>
                                <span className="ml-2">{readingPath.estimatedTime}</span>
                                <span className="mx-4">&bull;</span>
                                <span className="font-semibold">Articles:</span>
                                <span className="ml-2">{readingPath.posts.length}</span>
                            </div>
                        </div>

                        <div className="space-y-0">
                            {getPostsFromPath(readingPath).map((post, index) => (
                                <PathItem key={post.id} post={post} index={index} />
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <button
                                onClick={() => {
                                    setReadingPath(null);
                                    setTopic('');
                                }}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-zinc-600 text-base font-medium rounded-full text-gray-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Create New Path
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!readingPath && !isLoading && (
                <div className="text-center py-16">
                    <CompassIcon className="w-24 h-24 text-gray-300 dark:text-zinc-600 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Ready to start your learning journey?
                    </h3>
                    <p className="text-gray-500 dark:text-zinc-400">
                        Enter a topic above and let us create a personalized learning path for you.
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default PathfinderPage;