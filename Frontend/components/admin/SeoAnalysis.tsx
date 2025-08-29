import React, { useState, useMemo, useEffect } from 'react';
import { Post } from '../../types';
import { GoogleGenAI, Type } from '@google/genai';
import { TrendingUpIcon } from '../icons';
import { useData } from '../../hooks/useData';

const API_KEY = process.env.API_KEY;

interface SeoAnalysisProps {
  post: Partial<Post>;
  setPost: React.Dispatch<React.SetStateAction<Partial<Post>>>;
}

interface SeoResult {
    title: string;
    description: string;
    keywords: string[];
    feedback: string;
    score: 'Good' | 'Needs Improvement' | 'Poor';
}

const scoreStyles = {
    'Good': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Needs Improvement': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Poor': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const SeoAnalysis: React.FC<SeoAnalysisProps> = ({ post, setPost }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<SeoResult | null>(null);
    const { tags: allTags } = useData();

    const { postTextContent, canAnalyze } = useMemo(() => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content || '';
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        const can = (post.title?.trim()?.length ?? 0) > 5 && textContent.length > 50;
        return { postTextContent: textContent, canAnalyze: can };
    }, [post.content, post.title]);

    useEffect(() => {
        // When the source material changes, the old analysis is no longer valid.
        if (result) {
            setResult(null);
        }
    }, [post.title, postTextContent]);

    const handleAnalyze = async () => {
        if (!API_KEY) {
            setError('API Key is not configured.');
            return;
        }
        if (!canAnalyze) {
            setError('Please provide a title and at least 50 characters of content to analyze.');
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const prompt = `Analyze the following blog post for SEO. Provide a suggested meta title (max 60 chars), meta description (max 160 chars), 5-7 relevant keywords, a brief feedback, and an overall score ('Good', 'Needs Improvement', 'Poor').
            
            Title: ${post.title}
            Content: ${postTextContent.substring(0, 4000)}
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: 'SEO-optimized meta title, max 60 characters.' },
                            description: { type: Type.STRING, description: 'SEO-optimized meta description, max 160 characters.' },
                            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                            feedback: { type: Type.STRING, description: 'Brief, actionable SEO feedback.' },
                            score: { type: Type.STRING, description: "Overall SEO score: 'Good', 'Needs Improvement', or 'Poor'." },
                        },
                        required: ['title', 'description', 'keywords', 'feedback', 'score'],
                    },
                },
            });
            const jsonStr = response.text.trim();
            const jsonResponse = JSON.parse(jsonStr);
            setResult(jsonResponse);
        } catch (err) {
            console.error("SEO Analysis error:", err);
            setError("Failed to analyze SEO. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleApplyTitle = () => {
        if (result) setPost(p => ({ ...p, title: result.title }));
    };

    const handleApplyDescription = () => {
        if (result) setPost(p => ({ ...p, excerpt: result.description }));
    };
    
    const handleAddKeyword = (keyword: string) => {
        if (post.tags?.some(tag => tag.name.toLowerCase() === keyword.toLowerCase())) {
            return; // Tag already exists
        }
        let tagToAdd = allTags.find(t => t.name.toLowerCase() === keyword.toLowerCase());
        if (!tagToAdd) {
          tagToAdd = { id: `new-${Date.now()}-${keyword}`, name: keyword };
        }
        setPost(prev => ({ ...prev, tags: [...(prev.tags || []), tagToAdd] }));
    };

    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading || !canAnalyze}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 transition-all disabled:bg-slate-400 dark:disabled:bg-slate-600"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                ) : (
                    <TrendingUpIcon className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Analyzing...' : 'Analyze SEO'}
            </button>
            {!canAnalyze && <p className="text-xs text-slate-500 dark:text-slate-400">A title and content are needed for analysis.</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}

            {result && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <div>
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-semibold">Score</h4>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${scoreStyles[result.score]}`}>{result.score}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{result.feedback}</p>
                    </div>

                     <div>
                        <h4 className="text-sm font-semibold mb-1">Suggested Title</h4>
                        <div className="flex items-start gap-2">
                            <p className="flex-1 text-sm text-slate-600 dark:text-slate-300 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">{result.title}</p>
                            <button type="button" onClick={handleApplyTitle} className="text-xs font-bold text-primary-600 hover:underline flex-shrink-0 pt-2.5">APPLY</button>
                        </div>
                    </div>

                     <div>
                        <h4 className="text-sm font-semibold mb-1">Suggested Description</h4>
                         <div className="flex items-start gap-2">
                            <p className="flex-1 text-sm text-slate-600 dark:text-slate-300 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">{result.description}</p>
                            <button type="button" onClick={handleApplyDescription} className="text-xs font-bold text-primary-600 hover:underline flex-shrink-0 pt-2.5">APPLY</button>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-1">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.keywords.map(keyword => {
                                const isAdded = post.tags?.some(t => t.name.toLowerCase() === keyword.toLowerCase());
                                return (
                                    <button 
                                        key={keyword} 
                                        type="button"
                                        onClick={() => handleAddKeyword(keyword)}
                                        disabled={isAdded}
                                        className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${isAdded ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 cursor-default' : 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'}`}
                                    >
                                        + {keyword}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default SeoAnalysis;