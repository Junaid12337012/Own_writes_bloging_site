import React, { useState, useEffect } from 'react';
import { motion as motionTyped, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { ImageIcon, XIcon } from '../icons';

const motion = motionTyped as any;

const API_KEY = process.env.API_KEY;

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt: string;
  onImageSelect: (imageUrl: string) => void;
}

const loadingMessages = [
    "Warming up the pixels...",
    "Consulting the digital muse...",
    "Painting a masterpiece...",
    "Mixing virtual colors...",
    "Almost there...",
];

const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({ isOpen, onClose, initialPrompt, onImageSelect }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
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
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);
  
  const handleGenerate = async () => {
    if (!API_KEY) {
        setError("API Key is not configured.");
        return;
    }
    if (!prompt.trim()) {
        setError("Please enter a prompt for the image.");
        return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        setGeneratedImage(imageUrl);

    } catch (err) {
        console.error("Image generation error:", err);
        setError("Failed to generate image. The prompt may have been blocked. Please try a different prompt.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleUseImage = () => {
    if (generatedImage) {
        onImageSelect(generatedImage);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white flex items-center">
                <ImageIcon className="w-5 h-5 mr-3 text-primary-500" />
                Generate Post Image
              </h2>
              <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <XIcon className="w-6 h-6" />
              </button>
            </header>
            
            <div className="p-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Image Prompt</label>
                <textarea
                  id="prompt"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-slate-700 sm:text-sm"
                  placeholder="e.g., A minimalist workspace with a laptop and a steaming cup of coffee"
                />
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800 transition-all"
                >
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
              </div>

              {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}

              <div className="mt-6 aspect-video bg-slate-100 dark:bg-slate-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                {isLoading && (
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{loadingMessage}</p>
                  </div>
                )}
                {generatedImage && (
                  <img src={generatedImage} alt="Generated by AI" className="w-full h-full object-cover" />
                )}
                {!isLoading && !generatedImage && (
                    <div className="text-center text-slate-400 dark:text-slate-500 p-4">
                        <ImageIcon className="w-12 h-12 mx-auto"/>
                        <p className="mt-2 text-sm">Your generated image will appear here.</p>
                    </div>
                )}
              </div>

            </div>

            <footer className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
               <button
                  type="button"
                  onClick={handleUseImage}
                  disabled={!generatedImage || isLoading}
                  className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-800 transition-all"
                >
                  Use this Image
                </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageGenerationModal;