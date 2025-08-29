import React, { useMemo, useState } from 'react';
import { motion as motionTyped } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FileTextIcon, FolderIcon, UsersIcon, MessageSquareText, PenSquareIcon } from '../../components/icons';
import { useData } from '../../hooks/useData';
import { Post, Comment } from '../../types';
import { useToast } from '../../hooks/useToast';

const motion = motionTyped as any;

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
        delayChildren: 0.2,
      },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const StatCard: React.FC<{icon: React.ReactNode, title: string, value: number | string, color: string}> = ({ icon, title, value, color }) => (
    <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`rounded-full p-3 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </motion.div>
)

const BarChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md h-full">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Posts per Month</h2>
            <div className="flex justify-around items-end h-64 space-x-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end">
                         <motion.div
                            className="w-full bg-primary-500 rounded-t-md"
                            initial={{ height: 0 }}
                            animate={{ height: `${(item.value / maxValue) * 100}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <span className="relative -top-5 text-xs font-bold text-slate-700 dark:text-slate-200">{item.value}</span>
                        </motion.div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const QuickDraft: React.FC = () => {
    const [title, setTitle] = useState('');
    const { createPost, authors, categories } = useData();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSaveDraft = async () => {
        if (!title.trim()) {
            toast.error("Please enter a title for your draft.");
            return;
        }
        
        if (!authors.length || !categories.length) {
            toast.error("Please ensure you have at least one author and category before creating a post.");
            return;
        }
        
        const success = await createPost({
            title,
            status: 'draft',
            content: '<p>Start writing your new post...</p>',
            excerpt: '',
            imageUrl: '',
            author: authors[0],
            category: categories[0],
            tags: [],
            readingTime: 0,
            featured: false,
        });
        
        if (success) {
            toast.success(`Draft "${title}" created!`);
            setTitle('');
            navigate('/admin/posts');
        } else {
            toast.error('Failed to create draft. Please try again.');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md h-full">
             <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center">
                <PenSquareIcon className="w-5 h-5 mr-2 text-slate-400" />
                Quick Draft
            </h2>
            <div className="space-y-4">
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500 transition"
                />
                <button
                    onClick={handleSaveDraft}
                    className="w-full py-2 px-4 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800"
                >
                    Save Draft
                </button>
            </div>
        </div>
    );
};

const LatestCommentItem: React.FC<{ comment: Comment & { postTitle: string } }> = ({ comment }) => (
    <li className="py-3">
        <div className="flex items-start space-x-3">
            <img src={comment.authorAvatarUrl} alt={comment.authorName} className="w-8 h-8 rounded-full flex-shrink-0" />
            <div>
                <p className="text-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{comment.authorName}</span>
                    <span className="text-slate-500 dark:text-slate-400"> on </span>
                    <Link to={`/post/${comment.postId}`} target="_blank" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">{comment.postTitle}</Link>
                </p>
                <blockquote className="mt-1 text-sm text-slate-600 dark:text-slate-300 border-l-2 border-slate-300 dark:border-slate-600 pl-2 italic">
                    "{comment.text}"
                </blockquote>
            </div>
        </div>
    </li>
);

const AdminDashboardPage: React.FC = () => {
  const { posts, categories, authors, comments } = useData();
  
  const chartData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyCounts = Array(6).fill(0).map((_, i) => {
        const d = new Date(sixMonthsAgo);
        d.setMonth(d.getMonth() + i);
        return { name: monthNames[d.getMonth()], value: 0 };
    });

    posts.forEach(post => {
        const postDate = new Date(post.publishedDate);
        if (postDate >= sixMonthsAgo) {
            const monthIndex = (postDate.getFullYear() - sixMonthsAgo.getFullYear()) * 12 + postDate.getMonth() - sixMonthsAgo.getMonth();
            if (monthIndex >= 0 && monthIndex < 6) {
                monthlyCounts[monthIndex].value++;
            }
        }
    });
    return monthlyCounts;
  }, [posts]);

  const latestComments = comments
    .slice(0, 5)
    .map(comment => ({
        ...comment,
        postTitle: posts.find(p => p.id === comment.postId)?.title || 'Unknown Post',
    }));


  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h1>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard 
            icon={<FileTextIcon className="w-6 h-6 text-white"/>}
            title="Total Posts"
            value={posts.length}
            color="bg-blue-500"
        />
        <StatCard 
            icon={<FolderIcon className="w-6 h-6 text-white"/>}
            title="Total Categories"
            value={categories.length}
            color="bg-green-500"
        />
        <StatCard 
            icon={<UsersIcon className="w-6 h-6 text-white"/>}
            title="Total Authors"
            value={authors.length}
            color="bg-purple-500"
        />
        <StatCard 
            icon={<MessageSquareText className="w-6 h-6 text-white"/>}
            title="Total Comments"
            value={comments.length}
            color="bg-orange-500"
        />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2 h-[22rem]">
            <BarChart data={chartData} />
        </motion.div>
        <motion.div variants={itemVariants} className="h-full">
            <QuickDraft />
        </motion.div>
      </motion.div>
      
      <motion.div 
         variants={itemVariants} 
         initial="hidden"
         animate="visible"
         className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"
       >
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center">
                <MessageSquareText className="w-5 h-5 mr-2 text-slate-400" />
                Latest Comments
            </h2>
             <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {latestComments.length > 0 ? (
                    latestComments.map(comment => <LatestCommentItem key={comment.id} comment={comment} />)
                ) : (
                    <p className="text-sm text-center py-4 text-slate-500 dark:text-slate-400">No comments yet.</p>
                )}
            </ul>
        </motion.div>
    </motion.div>
  );
};

export default AdminDashboardPage;