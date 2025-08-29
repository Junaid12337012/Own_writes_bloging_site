import React, { useState } from 'react';
import { motion as motionTyped, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from './icons';

const motion = motionTyped as any;

// In a real app, this would be an environment variable.
const API_KEY = process.env.API_KEY;

const AiSummary: React.FC<{ content: string }> = ({ content }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const generateSummary = async () => {
    if (!API_KEY) {
      setError('API key is not configured.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      // Strip HTML tags from the content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      if (textContent.trim().length < 50) {
        setError("Article content is too short to summarize.");
        setIsLoading(false);
        return;
      }

      const prompt = `Summarize the following article in 3 to 5 concise bullet points. Focus on the main takeaways. Here is the article:\n\n${textContent.substring(0, 4000)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setSummary(response.text);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate summary. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
      setIsExpanded(!isExpanded);
      if (!isExpanded && !summary && !isLoading && !error) {
          generateSummary();
      }
  }

  const parseSummary = (text: string) => {
      return text.split(/[\n•*-]/).filter(item => item.trim() !== '').map((item, index) => (
        <li key={index} className="flex items-start">
            <span className="mr-3 text-primary-500 mt-1">&#8226;</span>
            <span>{item.trim()}</span>
        </li>
      ));
  }

  return (
    <section className="my-12 p-6 rounded-2xl border border-gray-200/50 dark:border-white/20 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-lg shadow-lg">
      <button onClick={handleToggle} className="w-full flex justify-between items-center text-left">
        <h2 className="flex items-center text-2xl font-bold font-serif text-gray-900 dark:text-white">
          <SparklesIcon className="w-6 h-6 mr-3 text-primary-500" />
          AI-Powered Summary
        </h2>
        <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </motion.div>
      </button>
      <AnimatePresence>
      {isExpanded && (
        <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
        >
          {isLoading && <div className="flex items-center justify-center p-4"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>}
          {error && <p className="text-red-500 p-4">{error}</p>}
          {summary && (
            <ul className="space-y-2 text-gray-600 dark:text-zinc-300">
                {parseSummary(summary)}
            </ul>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
};

export default AiSummary;