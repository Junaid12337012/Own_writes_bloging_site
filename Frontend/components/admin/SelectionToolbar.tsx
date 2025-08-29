import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from '../icons';

interface SelectionToolbarProps {
  editorRect: DOMRect | null;
  selectionRect: DOMRect | null;
  handleAiAction: (action: string, tone?: string) => void;
  isLoading: boolean;
}

const ToolbarButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode; }> = ({ onClick, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
  >
    {children}
  </button>
);

const ToneDropdown: React.FC<{ onSelect: (tone: string) => void }> = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const tones = ['Professional', 'Casual', 'Confident', 'Friendly'];

    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
                <Icons.PaletteIcon className="w-5 h-5" />
            </button>
             <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-slate-800 dark:bg-black rounded-md shadow-lg border border-slate-700"
                    >
                       {tones.map(tone => (
                           <button
                             key={tone}
                             type="button"
                             onMouseDown={(e) => e.preventDefault()}
                             onClick={() => onSelect(tone)}
                             className="block w-full text-left px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10"
                           >
                               {tone}
                           </button>
                       ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({ editorRect, selectionRect, handleAiAction, isLoading }) => {
  if (!editorRect || !selectionRect) return null;

  const top = selectionRect.top - editorRect.top - 45; // 45 is offset for height + margin
  const left = selectionRect.left - editorRect.left + selectionRect.width / 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.15 }}
      style={{ top: `${top}px`, left: `${left}px` }}
      className="absolute z-30 flex items-center gap-0 p-1 rounded-full bg-slate-900 shadow-lg"
      onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus
    >
        {isLoading ? (
            <div className="p-2">
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            </div>
        ) : (
            <>
                <ToolbarButton onClick={() => handleAiAction('improve')} title="Improve Writing">
                    <Icons.Wand2Icon className="w-5 h-5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => handleAiAction('fix')} title="Fix Spelling & Grammar">
                    <Icons.CheckSquareIcon className="w-5 h-5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => handleAiAction('shorter')} title="Make Shorter">
                    <Icons.ShrinkIcon className="w-5 h-5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => handleAiAction('longer')} title="Make Longer">
                    <Icons.ExpandIcon className="w-5 h-5" />
                </ToolbarButton>
                 <div className="w-px h-5 bg-white/20 mx-1"></div>
                <ToneDropdown onSelect={(tone) => handleAiAction('tone', tone)} />
            </>
        )}
    </motion.div>
  );
};

export default SelectionToolbar;
