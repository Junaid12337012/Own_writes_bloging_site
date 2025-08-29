import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface SecondaryFeaturedPostCardProps {
  post: Post;
}

const SecondaryFeaturedPostCard: React.FC<SecondaryFeaturedPostCardProps> = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className="block group relative rounded-2xl overflow-hidden shadow-lg h-full">
      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
         <span
            className="relative z-10 inline-block text-xs font-bold uppercase tracking-widest py-1 px-3 bg-primary-500 text-white rounded-full mb-2 w-fit"
        >
            {post.category.name}
        </span>
        <h3 className="text-lg font-bold font-serif leading-tight group-hover:underline decoration-white/50">{post.title}</h3>
        <p className="text-xs mt-1 opacity-80">{post.author.name}</p>
      </div>
    </Link>
  );
};

export default SecondaryFeaturedPostCard;
