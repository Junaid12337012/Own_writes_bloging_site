import React, { useRef, useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRightIcon } from './icons';
import { Category } from '../types';

interface TopicsNavBarProps {
  categories: Category[];
}

const TopicsNavBar: React.FC<TopicsNavBarProps> = ({ categories }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    }, []);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            checkScroll();
            scrollContainer.addEventListener('scroll', checkScroll, { passive: true });
            window.addEventListener('resize', checkScroll);

            return () => {
                scrollContainer.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [checkScroll]);

    const handleScroll = (scrollOffset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
        }
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
      `whitespace-nowrap py-2 text-sm transition-colors ${
        isActive
          ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
          : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
      }`;


    return (
        <div className="sticky top-14 sm:top-16 z-20 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-zinc-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                     {canScrollRight && (
                        <button onClick={() => handleScroll(200)} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 h-full w-12 items-center justify-end bg-gradient-to-l from-gray-50/80 dark:from-zinc-950/80 to-transparent z-10">
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                     )}
                    <div ref={scrollRef} className="flex items-center space-x-6 overflow-x-auto hide-scrollbar h-12">
                        <NavLink to="/" end className={navLinkClasses}>
                            For you
                        </NavLink>
                        {categories.map(cat => (
                            <NavLink key={cat.id} to={`/category/${cat.id}`} className={navLinkClasses}>
                                {cat.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicsNavBar;