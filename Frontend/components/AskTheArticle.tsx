import React, { useState, useRef, useEffect } from 'react';
import { motion as motionTyped, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { BotMessageSquareIcon } from './icons';

const motion = motionTyped as any;

// In a real app, this would be an environment variable.
const API_KEY = process.env.API_KEY;

interface Message {
    role: 'user' | 'model';
    text: string;
}

const AskTheArticle: React.FC<{ content: string }> = ({ content }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const initializeChat = async () => {
        if (!API_KEY) {
            setError('API key is not configured.');
            return;
        }
        if (chat) return;

        setIsLoading(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `You are an expert assistant. Your task is to answer questions based *only* on the provided article content. Do not use any external knowledge. If the answer is not in the article, say "I can't find that information in the article." The article content is as follows:\n\n---\n\n${textContent.substring(0, 8000)}`,
                },
            });
            setChat(newChat);
        } catch (err) {
            console.error("Error initializing chat:", err);
            setError("Could not start the chat session.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggle = () => {
      setIsExpanded(!isExpanded);
      if (!isExpanded && !chat) {
          initializeChat();
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;
        
        const userMessage: Message = { role: 'user', text: input.trim() };
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
            // Remove the empty model message on error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="my-12 p-6 rounded-2xl border border-gray-200/50 dark:border-white/20 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-lg shadow-lg">
            <button onClick={handleToggle} className="w-full flex justify-between items-center text-left">
                <h2 className="flex items-center text-2xl font-bold font-serif text-gray-900 dark:text-white">
                    <BotMessageSquareIcon className="w-6 h-6 mr-3 text-primary-500" />
                    Ask the Article
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
                        <div className="flex flex-col h-96 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
                            <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto hide-scrollbar">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-br-lg' : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-bl-lg shadow-sm'}`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                                    <div className="flex justify-start">
                                        <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800 rounded-bl-lg shadow-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {error && <p className="text-red-500 text-xs p-2 text-center flex-shrink-0 bg-red-50 dark:bg-red-900/20">{error}</p>}
                            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-zinc-700">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={isLoading ? "Thinking..." : "Ask a follow-up question..."}
                                        disabled={isLoading || !chat}
                                        className="flex-1 w-full px-4 py-2 text-sm bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                    />
                                    <button type="submit" disabled={isLoading || !input.trim() || !chat} className="p-2.5 rounded-full bg-primary-600 text-white disabled:bg-slate-400 dark:disabled:bg-zinc-600 hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-zinc-950">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default AskTheArticle;
