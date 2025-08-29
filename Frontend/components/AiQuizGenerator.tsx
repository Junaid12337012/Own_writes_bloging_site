import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from '@google/genai';
import { HelpCircleIcon, RefreshCwIcon } from './icons';

const API_KEY = process.env.API_KEY;

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface UserAnswer {
    questionIndex: number;
    answer: string;
    isCorrect: boolean;
}

const AiQuizGenerator: React.FC<{ content: string }> = ({ content }) => {
    const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateQuiz = async () => {
        if (!API_KEY) {
            setError('API key is not configured.');
            return;
        }

        setIsLoading(true);
        setError('');
        setQuiz([]);
        setUserAnswers([]);

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            if (textContent.trim().length < 100) {
                setError("Article content is too short to generate a quiz.");
                setIsLoading(false);
                return;
            }

            const prompt = `Based on the following article, create a quiz with 3 multiple-choice questions to test comprehension. For each question, provide one correct answer and two plausible but incorrect options.
            
            Article:
            ${textContent.substring(0, 4000)}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            quiz: {
                                type: Type.ARRAY,
                                description: 'An array of quiz questions.',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        question: { type: Type.STRING },
                                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        correctAnswer: { type: Type.STRING, description: "The exact string of the correct answer from the options array." },
                                    },
                                    required: ['question', 'options', 'correctAnswer']
                                }
                            }
                        },
                        required: ['quiz']
                    }
                }
            });

            const jsonResponse = JSON.parse(response.text.trim());
            // Ensure options are shuffled for variety
            jsonResponse.quiz.forEach((q: QuizQuestion) => {
                q.options.sort(() => Math.random() - 0.5);
            });
            setQuiz(jsonResponse.quiz);

        } catch (err) {
            console.error('Error generating quiz:', err);
            setError('Failed to generate a quiz for this article. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        if (userAnswers.some(a => a.questionIndex === questionIndex)) return; // Already answered

        const isCorrect = quiz[questionIndex].correctAnswer === answer;
        setUserAnswers(prev => [...prev, { questionIndex, answer, isCorrect }]);
    };

    const isFinished = userAnswers.length === quiz.length && quiz.length > 0;

    const score = userAnswers.filter(a => a.isCorrect).length;

    const getButtonClass = (questionIndex: number, option: string) => {
        const answer = userAnswers.find(a => a.questionIndex === questionIndex);
        if (!answer) {
            return 'bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700/50 dark:hover:bg-zinc-700'; // Default
        }
        
        const isCorrect = quiz[questionIndex].correctAnswer === option;
        const isSelected = answer.answer === option;

        if (isCorrect) {
            return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 ring-2 ring-green-500'; // Correct answer
        }
        if (isSelected && !isCorrect) {
            return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 ring-2 ring-red-500'; // Incorrectly selected
        }

        return 'bg-gray-100 dark:bg-zinc-700/50 text-gray-500 dark:text-zinc-400 cursor-not-allowed'; // Unselected other option
    };

    if (isLoading) {
        return (
            <section className="my-12 p-6 rounded-2xl border border-gray-200/50 dark:border-white/20 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-lg shadow-lg text-center">
                 <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                 <p className="mt-4 text-gray-500 dark:text-zinc-400">Generating your quiz...</p>
            </section>
        );
    }
    
    if (quiz.length === 0) {
        return (
            <section className="my-12 p-6 rounded-2xl border border-gray-200/50 dark:border-white/20 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-lg shadow-lg text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50 mb-4">
                    <HelpCircleIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">Test Your Knowledge</h2>
                <p className="mt-2 text-gray-600 dark:text-zinc-300 max-w-xl mx-auto">Think you've mastered the concepts in this article? Generate a quick quiz to find out!</p>
                <button
                    onClick={handleGenerateQuiz}
                    className="mt-6 inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Generate Quiz
                </button>
                 {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            </section>
        );
    }

    return (
         <section className="my-12 p-6 rounded-2xl border border-gray-200/50 dark:border-white/20 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-lg shadow-lg">
            <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white text-center mb-8">Comprehension Quiz</h2>
            <div className="space-y-8">
                {quiz.map((q, index) => (
                    <div key={index}>
                        <p className="font-semibold text-lg text-gray-800 dark:text-zinc-100">{index + 1}. {q.question}</p>
                        <div className="mt-4 space-y-3">
                            {q.options.map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerSelect(index, option)}
                                    disabled={userAnswers.some(a => a.questionIndex === index)}
                                    className={`w-full text-left p-3 rounded-lg transition-all text-gray-700 dark:text-zinc-200 ${getButtonClass(index, option)}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <AnimatePresence>
                {isFinished && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 pt-6 border-t border-gray-300 dark:border-zinc-600 text-center"
                    >
                        <h3 className="text-xl font-bold">Quiz Complete!</h3>
                        <p className="text-3xl font-bold font-serif my-2 text-primary-600 dark:text-primary-400">{score} / {quiz.length}</p>
                        <p className="text-gray-600 dark:text-zinc-300">You answered {score} questions correctly.</p>
                        <button
                            onClick={handleGenerateQuiz}
                            className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-100 rounded-full hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:hover:bg-primary-900"
                        >
                            <RefreshCwIcon className="w-4 h-4" />
                            Try a New Quiz
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
         </section>
    );
};

export default AiQuizGenerator;