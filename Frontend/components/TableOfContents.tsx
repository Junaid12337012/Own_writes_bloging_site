import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListCollapseIcon } from './icons';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  activeId: string | null;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, activeId }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80; // Height of sticky header + extra space
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="flex items-center text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
        <ListCollapseIcon className="w-4 h-4 mr-2" />
        On this page
      </h2>
      <ul className="space-y-1 border-l-2 border-slate-200 dark:border-zinc-700">
        {headings.map(heading => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleLinkClick(e, heading.id)}
              className={`block border-l-2 -ml-0.5 py-1 transition-colors duration-200 ${
                activeId === heading.id
                  ? 'border-primary-500 font-semibold text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-zinc-500'
              } ${heading.level === 3 ? 'pl-7' : 'pl-4'}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;