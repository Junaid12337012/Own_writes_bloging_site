import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from '@google/genai';
import { Wand2Icon, XIcon } from './icons';

const API_KEY = process.env.API_KEY;

const loadingMessages = [
    "Reading your story...",
    "Breaking down the narrative...",
    "Dreaming up the first scene...",
    "Visualizing the rising action...",
    "Crafting the climax...",
    "Painting the final panel...",
    "Assembling your storyboard...",
];

interface Scene {
    prompt: string;
    imageUrl: string;
}

const VisionWeaver: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    if (currentIndex >= loadingMessages.length - 1) {
                        clearInterval(interval);
                        return prev;
                    }
                    return loadingMessages[currentIndex + 1];
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleGenerate = async () => {
        if (!API_KEY) {
            setError("Sorry, Vision Weaver is not available right now. Please try again later.");
            return;
        }
        if (prompt.trim().length < 20) {
            setError("Please enter a prompt of at least 20 characters.");
            return;
        }

        setIsLoading(true);
        setError('');
        setScenes([]);
        setLoadingMessage(loadingMessages[0]);

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });

            // Step 1: Generate image prompts from the story
            setLoadingMessage(loadingMessages[1]);
            const textModelPrompt = `Analyze the following story or description and break it down into 4 key visual scenes. For each scene, create a concise, highly descriptive prompt suitable for an image generation AI. Focus on visual details: setting, characters, actions, and mood.
            
            Story: "${prompt}"`;
            
            const scenePromptsResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: textModelPrompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            scenes: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: 'An array of 4 descriptive image generation prompts.'
                            }
                        },
                        required: ['scenes']
                    }
                }
            });

            const { scenes: imagePrompts } = JSON.parse(scenePromptsResponse.text.trim());

            if (!imagePrompts || imagePrompts.length !== 4) {
                throw new Error("AI failed to generate 4 distinct scenes.");
            }

            // Step 2: Generate images for each prompt in parallel
            const imagePromises = imagePrompts.map((p: string) => 
                ai.models.generateImages({
                    model: 'imagen-3.0-generate-002',
                    prompt: `${p}, cinematic, high detail, vibrant colors`, // Enhance prompt
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: '16:9',
                    },
                })
            );

            const imageResults = await Promise.all(imagePromises);

            const generatedScenes: Scene[] = imageResults.map((res, index) => {
                const base64ImageBytes = res.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                return {
                    prompt: imagePrompts[index],
                    imageUrl: imageUrl,
                };
            });
            
            setScenes(generatedScenes);

        } catch (err) {
            console.error("Vision Weaver error:", err);
            setError("An error occurred while weaving your vision. The prompt may have been inappropriate, or the AI had trouble understanding it. Please try again with a different idea.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setPrompt('');
        setScenes([]);
        setError('');
    };
    
    const Lightbox: React.FC<{ imageUrl: string, onClose: () => void }> = ({ imageUrl, onClose }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={imageUrl}
                alt="Selected scene"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />
             <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <XIcon className="w-6 h-6" />
            </button>
        </motion.div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            {!isLoading && scenes.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <textarea
                        rows={5}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A lone astronaut discovers a glowing, ancient tree inside a cavern on a desolate moon. The tree's leaves pulse with light, casting strange shadows..."
                        className="w-full p-4 text-base bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                    />
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-blue-500 rounded-full hover:from-primary-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-zinc-950 transition-all shadow-lg hover:shadow-primary-500/50 transform hover:scale-105"
                        >
                            <Wand2Icon className="w-5 h-5 mr-2" />
                            Weave Vision
                        </button>
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {isLoading && (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-6 text-gray-500 dark:text-zinc-400 font-semibold">{loadingMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {scenes.length > 0 && !isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="p-6 bg-white dark:bg-zinc-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Your Storyboard:</h3>
                            <p className="font-medium italic text-gray-700 dark:text-zinc-300 mb-6 pb-6 border-b border-gray-200 dark:border-zinc-700">"{prompt}"</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {scenes.map((scene, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md cursor-pointer" onClick={() => setSelectedImage(scene.imageUrl)}>
                                            <img src={scene.imageUrl} alt={`Scene ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                        <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400 leading-relaxed italic">"{scene.prompt}"</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                         <div className="mt-8 flex justify-center">
                            <button onClick={handleReset} className="px-6 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-zinc-950 transition-all">
                                Start Over
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {selectedImage && <Lightbox imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default VisionWeaver;