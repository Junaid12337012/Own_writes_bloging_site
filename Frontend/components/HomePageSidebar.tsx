import React from 'react';
import { Link } from 'react-router-dom';
import { Post, Tag, Author } from '../types';

interface HomePageSidebarProps {
  featuredPosts: Post[];
  recommendedTopics: Tag[];
  authorsToFollow: Author[];
}

const StaffPickItem: React.FC<{ post: Post }> = ({ post }) => (
    <div className="group">
        <div className="flex items-center space-x-3 mb-2">
            <img src={post.author.avatarUrl} alt={post.author.name} className="w-6 h-6 rounded-full"/>
            <p className="text-sm font-medium text-gray-800 dark:text-zinc-200">{post.author.name}</p>
        </div>
        <Link to={`/post/${post.id}`}>
            <h3 className="font-bold font-serif text-base leading-tight group-hover:underline text-gray-900 dark:text-white">{post.title}</h3>
        </Link>
    </div>
);

const AuthorToFollowItem: React.FC<{ author: Author }> = ({ author }) => (
    <div className="flex items-center space-x-4">
        <Link to={`/author/${author.id}`}>
            <img src={author.avatarUrl} alt={author.name} className="w-12 h-12 rounded-full" />
        </Link>
        <div className="flex-1">
            <Link to={`/author/${author.id}`} className="group">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:underline">{author.name}</h4>
            </Link>
            <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2">{author.bio}</p>
        </div>
    </div>
);


const HomePageSidebar: React.FC<HomePageSidebarProps> = ({ featuredPosts, recommendedTopics, authorsToFollow }) => {
    return (
        <div className="sticky top-28">
            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto space-y-10 hide-scrollbar">
                {/* Staff Picks Section */}
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Staff Picks</h3>
                    <div className="space-y-4">
                        {featuredPosts.map(post => <StaffPickItem key={post.id} post={post} />)}
                    </div>
                    <Link to="/categories" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 inline-block">
                        See the full list
                    </Link>
                </div>

                {/* Recommended Topics Section */}
                <div>
                     <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recommended topics</h3>
                     <div className="flex flex-wrap gap-2">
                         {recommendedTopics.map(topic => (
                            <Link key={topic.id} to={`/tag/${topic.id}`} className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors">
                                {topic.name}
                            </Link>
                        ))}
                     </div>
                </div>

                {/* Who to follow Section */}
                <div>
                     <h3 className="font-bold text-gray-900 dark:text-white mb-4">Who to follow</h3>
                     <div className="space-y-6">
                         {authorsToFollow.map(author => <AuthorToFollowItem key={author.id} author={author} />)}
                     </div>
                     <Link to="/about" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 inline-block">
                        See more suggestions
                    </Link>
                </div>
                
                 <div className="text-xs text-gray-500 dark:text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                    <Link to="/about" className="hover:underline">Help</Link>
                    <Link to="/about" className="hover:underline">Status</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/contact" className="hover:underline">Careers</Link>
                    <Link to="/contact" className="hover:underline">Press</Link>
                    <Link to="/privacy" className="hover:underline">Privacy</Link>
                    <Link to="/terms" className="hover:underline">Terms</Link>
                </div>
            </div>
        </div>
    );
};

export default HomePageSidebar;