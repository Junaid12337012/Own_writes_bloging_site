import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from './icons';

const API_KEY = process.env.API_KEY;

const loadingMessages = [
    "Brewing a fantastic tale...",
    "The AI is pondering...",
    "Words are forming...",
    "Consulting the digital muse...",
    "Weaving threads of imagination...",
];

const StoryWriter: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleGenerateStory = async () => {
        if (!API_KEY) {
            setError("Sorry, the story writer is not available right now. Please try again later.");
            return;
        }
        if (!prompt.trim()) {
            setError("Please enter a prompt to start your story.");
            return;
        }

        setIsLoading(true);
        setError('');
        setStory('');

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: `Write a short, creative story based on the following prompt. The story should be engaging and well-structured. Prompt: "${prompt}"`,
                config: {
                    systemInstruction: "You are a master storyteller, known for crafting imaginative and captivating short stories.",
                }
            });

            for await (const chunk of stream) {
                setStory(prev => prev + chunk.text);
            }

        } catch (err) {
            console.error("Story generation error:", err);
            setError("An error occurred while writing your story. It's possible the prompt was inappropriate. Please try again with a different idea.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(story);
        // Maybe show a small "Copied!" notification in a real app
    };

    const handleReset = () => {
        setPrompt('');
        setStory('');
        setError('');
    };

    return (
        <div className="max-w-3xl mx-auto">
            {!story && !isLoading && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-full">
                        <label htmlFor="prompt" className="sr-only">Story Prompt</label>
                        <textarea
                            id="prompt"
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A brave knight and a wise dragon on a quest to find a hidden treasure..."
                            className="w-full p-4 text-base bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                        />
                    </div>
                     {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleGenerateStory}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-zinc-950 transition-all shadow-lg hover:shadow-primary-500/50 transform hover:scale-105"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Generate Story
                        </button>
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-16"
                    >
                         <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                         <p className="mt-6 text-gray-500 dark:text-zinc-400 font-semibold">{loadingMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
            {story && !isLoading && (
                 <motion.div
                    key="story-result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700">
                         <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Your Story Prompt:</h3>
                         <p className="font-semibold italic text-gray-700 dark:text-zinc-300 mb-6 pb-6 border-b border-gray-200 dark:border-zinc-700">"{prompt}"</p>
                         <div className="prose prose-lg dark:prose-invert max-w-none mx-auto font-serif text-gray-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {story}
                         </div>
                    </div>
                    <div className="mt-6 flex justify-center gap-4">
                        <button onClick={handleCopy} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-zinc-950 transition-all">
                            Copy to Clipboard
                        </button>
                         <button onClick={handleReset} className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-zinc-950 transition-all">
                            Start Over
                        </button>
                    </div>
                </motion.div>
            )}
             </AnimatePresence>
        </div>
    );
};

export default StoryWriter;