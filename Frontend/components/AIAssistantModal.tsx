import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { useData } from '../hooks/useData';
import { XIcon, SparklesIcon } from './icons';
import { Link } from 'react-router-dom';

const API_KEY = process.env.API_KEY;

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { publishedPosts, siteSettings } = useData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chat) {
      initializeChat();
    }
  }, [isOpen, chat]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const initializeChat = async () => {
    if (!API_KEY) {
      setError('The AI Assistant is currently unavailable.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const postsContext = publishedPosts.map(p => ({
        id: p.id,
        title: p.title,
        author: p.author.name,
        category: p.category.name,
        excerpt: p.excerpt,
      }));

      const systemInstruction = `You are a helpful and friendly AI assistant for a blog called "${siteSettings.title}". Your goal is to help users discover content. You must answer questions based *only* on the provided list of articles. Do not use external knowledge.

When a user asks a question, find the most relevant article(s) from the list and use their content to answer.
- You can summarize articles, find articles by author, topic, or category, and answer specific questions about article content.
- When you mention an article, ALWAYS format it as a special link: [Article Title](post_id). For example, if you are referencing an article with id '1', you would write [Unveiling the Hidden Gems of the Amalfi Coast](1).
- If the answer isn't in the provided articles, state that clearly and suggest related topics you can help with based on the available articles.
- Keep your answers concise and helpful.

Here is the list of available articles:
${JSON.stringify(postsContext)}
`;

      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
      });
      setChat(newChat);
      setMessages([{
        role: 'model',
        text: `Hello! I'm your AI Assistant. How can I help you discover content on ${siteSettings.title} today? Feel free to ask me anything about our articles.`
      }]);
    } catch (err) {
      console.error("Error initializing chat:", err);
      setError("Failed to initialize the AI Assistant. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, prompt?: string) => {
    e.preventDefault();
    const userInput = prompt || input;
    if (!userInput.trim() || isLoading || !chat) return;

    const userMessage: Message = { role: 'user', text: userInput.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const result = await chat.sendMessageStream({ message: userMessage.text });
      let currentModelMessage = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        currentModelMessage += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = currentModelMessage;
          return newMessages;
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Sorry, something went wrong. Please try again.');
      setMessages(prev => prev.slice(0, -1)); // Remove the empty model message
    } finally {
      setIsLoading(false);
    }
  };
  
  const parseResponse = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\((\w+)\)/g;
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const [fullMatch, linkText, postId] = match;
      parts.push(
        <Link key={match.index} to={`/post/${postId}`} onClick={onClose} className="text-primary-500 font-semibold underline hover:text-primary-600">
          {linkText}
        </Link>
      );
      lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</>;
  };

  const suggestedPrompts = [
      "Summarize the latest tech article",
      "Who is Elena Voyage?",
      "Find posts about solo travel"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-end p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md h-[85vh] max-h-[700px] bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold font-serif text-gray-900 dark:text-white flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 text-primary-500" />
                AI Assistant
              </h2>
              <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700">
                <XIcon className="w-6 h-6" />
              </button>
            </header>
            
            <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto hide-scrollbar">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-br-lg' : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-bl-lg'}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{parseResponse(msg.text)}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length-1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-gray-100 dark:bg-zinc-800 rounded-bl-lg">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
              {messages.length <= 1 && !isLoading && (
                  <div className="pt-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase">Try asking:</p>
                      {suggestedPrompts.map(p => (
                          <button key={p} onClick={(e) => handleSubmit(e, p)} className="w-full text-left p-2 text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/80 transition-colors">
                            "{p}"
                          </button>
                      ))}
                  </div>
              )}
            </div>
            
            {error && <p className="text-red-500 text-xs p-2 text-center flex-shrink-0">{error}</p>}
            <footer className="p-4 border-t border-gray-200 dark:border-zinc-800">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLoading ? "Thinking..." : "Ask a question..."}
                  disabled={isLoading || !chat}
                  className="flex-1 w-full px-4 py-2 text-sm bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
                <button type="submit" disabled={isLoading || !input.trim() || !chat} className="p-2.5 rounded-full bg-primary-600 text-white disabled:bg-slate-400 dark:disabled:bg-zinc-600 hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-zinc-950">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAssistantModal;