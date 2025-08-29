import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon, Trash2Icon } from '../icons';

interface ImageControlPopoverProps {
  imageElement: HTMLImageElement;
  onUpdate: () => void;
  onRemove: () => void;
  onClose: () => void;
  popoverRef: React.RefObject<HTMLDivElement>;
}

const ImageControlPopover: React.FC<ImageControlPopoverProps> = ({ imageElement, onUpdate, onRemove, onClose, popoverRef }) => {
    const [size, setSize] = useState({
        width: imageElement.style.width || imageElement.getAttribute('width') || 'auto',
        height: imageElement.style.height || imageElement.getAttribute('height') || 'auto',
    });

    useEffect(() => {
        // Update state if a different image is selected
        setSize({
            width: imageElement.style.width || imageElement.getAttribute('width') || 'auto',
            height: imageElement.style.height || imageElement.getAttribute('height') || 'auto'
        });
    }, [imageElement]);

    const applyStyles = (newStyles: Partial<CSSStyleDeclaration>) => {
        // Reset alignment styles before applying new ones
        const resetStyles: Partial<CSSStyleDeclaration> = {
             display: '', marginLeft: '', marginRight: ''
        };
        if ('display' in newStyles) { // If setting alignment
             Object.assign(imageElement.style, {...resetStyles, ...newStyles});
        } else { // If setting size
             Object.assign(imageElement.style, newStyles);
        }
        onUpdate();
    };
    
    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSize(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleApplySize = () => {
        applyStyles({
            width: size.width,
            height: size.height,
            maxWidth: size.width.endsWith('%') ? size.width : '100%', // Keep responsive if % is used
        });
    };
    
    const setAlignment = (align: 'left' | 'center' | 'right') => {
        if (align === 'center') {
            applyStyles({ display: 'block', marginLeft: 'auto', marginRight: 'auto' });
        } else if (align === 'right') {
            applyStyles({ display: 'block', marginLeft: 'auto', marginRight: '0' });
        } else { // left
            applyStyles({ display: 'block', marginLeft: '0', marginRight: 'auto' });
        }
    };
    
    const rect = imageElement.getBoundingClientRect();
    const top = rect.top - 60; // Popover height + margin
    const left = rect.left + rect.width / 2;

    const popoverStyle = {
        position: 'fixed' as const,
        top: `${top}px`,
        left: `${left}px`,
    };

    return (
        <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={popoverStyle}
            className="z-50 flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 -translate-x-1/2"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <input type="text" name="width" value={size.width} onChange={handleSizeChange} onBlur={handleApplySize} placeholder="Width" className="w-20 px-2 py-1 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"/>
            <span className="text-sm text-slate-400">x</span>
            <input type="text" name="height" value={size.height} onChange={handleSizeChange} onBlur={handleApplySize} placeholder="Height" className="w-20 px-2 py-1 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"/>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
            <button type="button" onClick={() => setAlignment('left')} title="Align Left" className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><AlignLeftIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => setAlignment('center')} title="Align Center" className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><AlignCenterIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => setAlignment('right')} title="Align Right" className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><AlignRightIcon className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
            <button type="button" onClick={onRemove} title="Remove Image" className="p-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"><Trash2Icon className="w-4 h-4" /></button>
        </motion.div>
    );
};

export default ImageControlPopover;
