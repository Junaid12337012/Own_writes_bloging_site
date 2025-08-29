import React from 'react';
import { useData } from '../../hooks/useData';
import { Snippet } from '../../types';
import * as Icons from '../icons';

const SnippetsSidebar: React.FC = () => {
  const { snippets } = useData();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, snippet: Snippet) => {
    e.dataTransfer.setData('application/inkwell-snippet', snippet.content);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const IconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-6 h-6 text-primary-500 dark:text-primary-400" /> : <Icons.PenSquareIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />;
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 space-y-4">
       <h2 className="text-lg font-bold text-slate-900 dark:text-white">Content Snippets</h2>
       <p className="text-sm text-slate-500 dark:text-slate-400">Drag & drop reusable blocks into your content.</p>
       <div className="space-y-3">
            {snippets.map(snippet => (
                <div
                    key={snippet.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, snippet)}
                    className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary-400 dark:hover:border-primary-500 transition-all"
                >
                    <div className="flex-shrink-0 mr-4 pt-0.5">
                        {IconComponent(snippet.icon)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{snippet.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{snippet.description}</p>
                    </div>
                </div>
            ))}
       </div>
    </div>
  );
};

export default SnippetsSidebar;