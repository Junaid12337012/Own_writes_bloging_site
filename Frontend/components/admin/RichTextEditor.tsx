import React, { useRef, useCallback, useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import * as Icons from '../icons';
import SelectionToolbar from './SelectionToolbar';
import UrlInputPopover from './UrlInputPopover';
import ImageControlPopover from './ImageControlPopover';

const API_KEY = process.env.API_KEY;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type BlockType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote' | 'pre';

type ActiveFormats = {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    subscript?: boolean;
    superscript?: boolean;
    isLink?: boolean;
    blockType?: BlockType;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    isUL?: boolean;
    isOL?: boolean;
    isHighlighted?: boolean;
};

const HIGHLIGHT_COLORS = {
    yellow: '#fef9c3', // bg-yellow-100
    green: '#dcfce7',  // bg-green-100
    blue: '#dbeafe',   // bg-blue-100
    pink: '#fce7f3',   // bg-pink-100
    purple: '#f3e8ff', // bg-purple-100
};

// --- Reusable Toolbar Components ---

const EditorButton: React.FC<{
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  title: string;
  isActive?: boolean;
}> = ({ onClick, children, title, isActive }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-colors ${isActive ? 'bg-primary-100 text-primary-600 dark:bg-primary-800/50 dark:text-primary-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
    onMouseDown={(e) => e.preventDefault()}
  >
    {children}
  </button>
);

const ToolbarDivider: React.FC = () => <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>;


// --- Main Editor Component ---

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const savedRange = useRef<Range | null>(null);
  const [selectionToolbarState, setSelectionToolbarState] = useState<{
    visible: boolean;
    selectionRect: DOMRect | null;
    editorRect: DOMRect | null;
  }>({ visible: false, selectionRect: null, editorRect: null });
  const [popoverState, setPopoverState] = useState<{
    anchorEl: HTMLElement | null;
    type: 'link' | 'image' | 'video' | null;
    initialValue: string;
  }>({ anchorEl: null, type: null, initialValue: '' });
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const imageControlPopoverRef = useRef<HTMLDivElement>(null);


  // --- AI Tools ---
  const handleAiAction = async (action: string, tone?: string) => {
    if (!API_KEY) {
        setAiError("API Key is not configured.");
        setTimeout(() => setAiError(''), 3000);
        return;
    }

    if (!savedRange.current) {
        setAiError('Please select text first.');
        setTimeout(() => setAiError(''), 3000);
        return;
    }
    const selectedText = savedRange.current.toString();

    if (selectedText.trim().length < 10) {
       setAiError('Please select at least 10 characters of text.');
       setTimeout(() => setAiError(''), 3000);
       return;
    }

    setIsAiLoading(true);
    setAiError('');

    let prompt = '';
    switch (action) {
        case 'improve':
            prompt = `Improve the following text for clarity, engagement, and flow, without changing its core meaning. Text: "${selectedText}"`;
            break;
        case 'fix':
            prompt = `Fix all spelling and grammar mistakes in the following text. Only return the corrected text. Text: "${selectedText}"`;
            break;
        case 'shorter':
            prompt = `Make the following text more concise. Text: "${selectedText}"`;
            break;
        case 'longer':
            prompt = `Expand upon the following text, adding more detail and explanation. Text: "${selectedText}"`;
            break;
        case 'tone':
            prompt = `Rewrite the following text in a ${tone} tone. Text: "${selectedText}"`;
            break;
        default:
            setIsAiLoading(false);
            return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const resultText = response.text.trim();

        if (savedRange.current && editorRef.current) {
            const currentSelection = window.getSelection();
            currentSelection?.removeAllRanges();
            currentSelection?.addRange(savedRange.current);
            document.execCommand('insertText', false, resultText);
            onChange(editorRef.current.innerHTML);
            requestAnimationFrame(() => {
                if(savedRange.current) {
                    const newRange = document.createRange();
                    newRange.setStart(savedRange.current.startContainer, savedRange.current.startOffset);
                    newRange.setEnd(savedRange.current.startContainer, savedRange.current.startOffset + resultText.length);
                    currentSelection?.removeAllRanges();
                    currentSelection?.addRange(newRange);
                }
                updateToolbarState();
            });
        }
    } catch (err) {
        console.error("AI Action error:", err);
        setAiError('AI tool failed. Please try again.');
        setTimeout(() => setAiError(''), 3000);
    } finally {
        setIsAiLoading(false);
        setSelectionToolbarState(prev => ({ ...prev, visible: false }));
        savedRange.current = null;
    }
  };

  // --- Effects ---

  useLayoutEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const updateToolbarState = useCallback(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !editorRef.current?.contains(selection.anchorNode)) {
        setActiveFormats({});
        return;
      };

      const newFormats: ActiveFormats = {};
      
      (['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'] as const).forEach(cmd => {
          if (document.queryCommandState(cmd)) newFormats[cmd] = true;
      });

      const blockTag = document.queryCommandValue('formatBlock').toLowerCase();
      const validBlockTags: BlockType[] = ['p', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'pre'];
      if (validBlockTags.includes(blockTag as BlockType)) {
          newFormats.blockType = blockTag as BlockType;
      } else {
          let parent = selection.getRangeAt(0).commonAncestorContainer;
          if (parent.nodeType === Node.TEXT_NODE) parent = parent.parentNode!;
          while (parent && parent !== editorRef.current) {
              const tagName = (parent as HTMLElement).tagName?.toLowerCase();
              if (validBlockTags.includes(tagName as BlockType)) {
                  newFormats.blockType = tagName as BlockType;
                  break;
              }
              parent = parent.parentNode!;
          }
      }
      if (!newFormats.blockType) newFormats.blockType = 'p';

      newFormats.isUL = document.queryCommandState('insertUnorderedList');
      newFormats.isOL = document.queryCommandState('insertOrderedList');

      let parent = selection.anchorNode;
      if (parent?.nodeType === Node.TEXT_NODE) parent = parent.parentElement;
      
      while (parent && parent !== editorRef.current) {
          if (parent instanceof Element) {
            if (parent instanceof HTMLAnchorElement && !newFormats.isLink) newFormats.isLink = true;
            
            const bgColor = (parent as HTMLElement).style.backgroundColor;
            if (bgColor && bgColor !== 'transparent' && !newFormats.isHighlighted) newFormats.isHighlighted = true;
            
            const textAlign = (parent as HTMLElement).style.textAlign;
            if (textAlign && !newFormats.textAlign) newFormats.textAlign = textAlign as any;
          }
          parent = parent.parentElement;
      }
      
      newFormats.textAlign = newFormats.textAlign || 'left';
      setActiveFormats(newFormats);
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (
            !selection ||
            selection.isCollapsed ||
            !editorRef.current?.contains(selection.anchorNode)
        ) {
            if (selectionToolbarState.visible) {
                setSelectionToolbarState({ visible: false, selectionRect: null, editorRect: null });
            }
            return;
        }

        const range = selection.getRangeAt(0);
        const selectionRect = range.getBoundingClientRect();
        const editorRect = editorRef.current?.getBoundingClientRect() ?? null;
        
        if (selectionRect.width < 1 && selectionRect.height < 1) {
            setSelectionToolbarState({ visible: false, selectionRect: null, editorRect: null });
            return;
        }
        
        savedRange.current = range.cloneRange();
        setSelectionToolbarState({ visible: true, selectionRect, editorRect });
    };
    
    const handleMouseDown = (e: MouseEvent) => {
        // Hide toolbar immediately on new click inside editor, unless it's a popover
        if (editorRef.current?.contains(document.activeElement) && !(e.target as HTMLElement).closest('[data-popover]')) {
            setSelectionToolbarState({ visible: false, selectionRect: null, editorRect: null });
        }
    }
    
    document.addEventListener('mouseup', handleMouseUp);
    editorRef.current?.addEventListener('mousedown', handleMouseDown);
    
    return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        editorRef.current?.removeEventListener('mousedown', handleMouseDown);
    };
}, [selectionToolbarState.visible]);

useEffect(() => {
    const handleEditorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        // Don't hide if clicking inside image control popover
        if (imageControlPopoverRef.current?.contains(target)) return;
        
        if (target instanceof HTMLImageElement && editorRef.current?.contains(target)) {
            setSelectedImage(target);
        } else {
            setSelectedImage(null);
        }
    };
    
    const editorEl = editorRef.current;
    editorEl?.addEventListener('click', handleEditorClick);

    return () => {
        editorEl?.removeEventListener('click', handleEditorClick);
    };
}, []);


  useEffect(() => {
    const listener = () => updateToolbarState();
    document.addEventListener('selectionchange', listener);
    const editor = editorRef.current;
    if (editor) {
        editor.addEventListener('keyup', listener);
        editor.addEventListener('focus', listener);
    }
    return () => {
        document.removeEventListener('selectionchange', listener);
        if (editor) {
            editor.removeEventListener('keyup', listener);
            editor.removeEventListener('focus', listener);
        }
    };
  }, [updateToolbarState]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        let pasteHtml = e.clipboardData?.getData('text/html');
        
        if (pasteHtml) {
            const doc = new DOMParser().parseFromString(pasteHtml, 'text/html');
            doc.querySelectorAll('script, style, link, meta').forEach(el => el.remove());
            doc.querySelectorAll('*').forEach(el => {
                Array.from(el.attributes).forEach(attr => {
                    if (!['href', 'src', 'alt', 'title'].includes(attr.name.toLowerCase())) {
                        el.removeAttribute(attr.name);
                    }
                });
            });
            document.execCommand('insertHTML', false, doc.body.innerHTML);
        } else {
            const text = e.clipboardData?.getData('text/plain');
            if (text) {
                const paragraphs = text.split(/\r?\n/).map(p => p.trim()).filter(p => p.length > 0);
                const html = paragraphs.map(p => `<p>${p}</p>`).join('');
                document.execCommand('insertHTML', false, html);
            }
        }
    };

    editor.addEventListener('paste', handlePaste);
    return () => {
        editor.removeEventListener('paste', handlePaste);
    };
  }, []);

  // --- Commands & Handlers ---
  
  const executeCommand = useCallback((command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
        requestAnimationFrame(() => updateToolbarState());
    }
  }, [onChange, updateToolbarState]);

  const toggleBlockType = (type: BlockType) => {
    if (activeFormats.blockType === type) {
      executeCommand('formatBlock', '<p>');
    } else {
      executeCommand('formatBlock', `<${type}>`);
    }
  };

  const toggleInlineStyle = (command: string) => executeCommand(command);

  const setAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
      const command = 'justify' + align.charAt(0).toUpperCase() + align.slice(1);
      executeCommand(command);
  }

  const highlightText = (color: string) => executeCommand('hiliteColor', color);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const base64Url = loadEvent.target?.result as string;
            const imgHtml = `<img src="${base64Url}" alt="${file.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; display: block;" />`;
            
            if (editorRef.current) {
                editorRef.current.focus();
                executeCommand('insertHTML', imgHtml);
            }
        };
        reader.readAsDataURL(file);
    }
    if (e.target) {
        e.target.value = '';
    }
  };

  // --- Popover Handlers ---

  const handleOpenPopover = (e: React.MouseEvent, type: 'link' | 'image' | 'video') => {
    if (popoverState.anchorEl === e.currentTarget) {
        handlePopoverClose();
        return;
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    savedRange.current = selection.getRangeAt(0).cloneRange();

    let initialValue = '';
    if (type === 'link') {
      let parent = selection.anchorNode;
      if (parent?.nodeType === Node.TEXT_NODE) parent = parent.parentElement;
      while (parent && parent !== editorRef.current) {
        if (parent instanceof HTMLAnchorElement) {
          initialValue = parent.href;
          break;
        }
        parent = parent.parentElement;
      }
    }
    
    setPopoverState({ anchorEl: e.currentTarget as HTMLElement, type, initialValue });
  };

  const handlePopoverClose = () => {
    setPopoverState({ anchorEl: null, type: null, initialValue: '' });
  };

  const handlePopoverSubmit = (url: string) => {
    if (savedRange.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange.current);
    }
    
    if (popoverState.type === 'link') {
      executeCommand('createLink', url);
    } else if (popoverState.type === 'image') {
      const imgHtml = `<img src="${url}" alt="User inserted image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; display: block;" />`;
      executeCommand('insertHTML', imgHtml);
    } else if (popoverState.type === 'video') {
      let embedHtml = '';
      const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/);

      if (ytMatch && ytMatch[1]) {
        embedHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;"><iframe src="https://www.youtube-nocookie.com/embed/${ytMatch[1]}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
      } else {
        const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)/);
        if (vimeoMatch && vimeoMatch[1]) {
            embedHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;"><iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
        }
      }

      if (embedHtml) {
        executeCommand('insertHTML', `<p>${embedHtml}</p><p>&nbsp;</p>`);
      } else {
        alert('Invalid URL. Please use a valid YouTube or Vimeo link.');
      }
    }

    handlePopoverClose();
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(false); };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if(document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if(range) {
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
    editorRef.current.focus();

    const snippetContent = e.dataTransfer.getData('application/inkwell-snippet');
    if (snippetContent) {
        executeCommand('insertHTML', snippetContent);
        return;
    }

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const base64Url = loadEvent.target?.result as string;
            const imgHtml = `<img src="${base64Url}" alt="${files[0].name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; display: block;" />`;
            executeCommand('insertHTML', imgHtml);
        };
        reader.readAsDataURL(files[0]);
    }
  };
  
  const handleImageUpdate = () => {
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageRemove = () => {
    if (selectedImage) {
        selectedImage.remove();
        handleImageUpdate();
        setSelectedImage(null);
    }
  };


  const currentBlockType = activeFormats.blockType || 'p';

  return (
    <div className={`relative rounded-md border shadow-sm bg-white dark:bg-slate-800 transition-all ${isDraggingOver ? 'border-primary-500 ring-2 ring-primary-500' : 'border-slate-300 dark:border-slate-600 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500'}`}>
      {/* --- Toolbar --- */}
      <div className="p-1 border-b border-slate-300 dark:border-slate-600 flex flex-wrap items-center gap-1 sticky top-16 bg-white dark:bg-slate-800 z-10">
          <Dropdown title="Style" value={currentBlockType.toUpperCase()}>
              <DropdownItem type="button" onClick={() => toggleBlockType('p')} isActive={currentBlockType === 'p'}>Paragraph</DropdownItem>
              <DropdownItem type="button" onClick={() => toggleBlockType('h1')} isActive={currentBlockType === 'h1'}><h1>Heading 1</h1></DropdownItem>
              <DropdownItem type="button" onClick={() => toggleBlockType('h2')} isActive={currentBlockType === 'h2'}><h2>Heading 2</h2></DropdownItem>
              <DropdownItem type="button" onClick={() => toggleBlockType('h3')} isActive={currentBlockType === 'h3'}><h3>Heading 3</h3></DropdownItem>
              <DropdownItem type="button" onClick={() => toggleBlockType('h4')} isActive={currentBlockType === 'h4'}><h4>Heading 4</h4></DropdownItem>
          </Dropdown>
          <ToolbarDivider />
           <div className="relative">
                <Dropdown title="AI Tools" icon={isAiLoading ? <div className="w-5 h-5 border-2 border-primary-500/50 border-t-primary-500 rounded-full animate-spin"></div> : <Icons.Wand2Icon className="w-5 h-5" />}>
                    <DropdownItem type="button" onClick={() => handleAiAction('improve')} >Improve Writing</DropdownItem>
                    <DropdownItem type="button" onClick={() => handleAiAction('fix')} >Fix Spelling & Grammar</DropdownItem>
                    <DropdownItem type="button" onClick={() => handleAiAction('shorter')} >Make Shorter</DropdownItem>
                    <DropdownItem type="button" onClick={() => handleAiAction('longer')} >Make Longer</DropdownItem>
                    <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>
                    <Dropdown title="Change Tone" isSubmenu={true}>
                        <DropdownItem type="button" onClick={() => handleAiAction('tone', 'Professional')} >Professional</DropdownItem>
                        <DropdownItem type="button" onClick={() => handleAiAction('tone', 'Casual')} >Casual</DropdownItem>
                        <DropdownItem type="button" onClick={() => handleAiAction('tone', 'Confident')} >Confident</DropdownItem>
                         <DropdownItem type="button" onClick={() => handleAiAction('tone', 'Friendly')} >Friendly</DropdownItem>
                    </Dropdown>
                </Dropdown>
                {aiError && <div className="absolute top-full mt-1 text-xs text-red-500 whitespace-nowrap">{aiError}</div>}
           </div>

          <ToolbarDivider />
          <EditorButton onClick={() => toggleInlineStyle('bold')} title="Bold" isActive={activeFormats.bold}><Icons.BoldIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => toggleInlineStyle('italic')} title="Italic" isActive={activeFormats.italic}><Icons.ItalicIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => toggleInlineStyle('underline')} title="Underline" isActive={activeFormats.underline}><Icons.UnderlineIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => toggleInlineStyle('strikeThrough')} title="Strikethrough" isActive={activeFormats.strikethrough}><Icons.StrikethroughIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => toggleInlineStyle('superscript')} title="Superscript" isActive={activeFormats.superscript}><Icons.SuperscriptIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => toggleInlineStyle('subscript')} title="Subscript" isActive={activeFormats.subscript}><Icons.SubscriptIcon className="w-5 h-5" /></EditorButton>
          
          <Dropdown title="Highlight" icon={<Icons.HighlighterIcon className="w-5 h-5" />} isActive={activeFormats.isHighlighted}>
              <div className="grid grid-cols-5 gap-1 p-1">
                  {Object.entries(HIGHLIGHT_COLORS).map(([name, color]) => (
                      <button type="button" key={name} onMouseDown={(e) => e.preventDefault()} onClick={() => highlightText(color)} className="w-6 h-6 rounded-sm border border-slate-300 dark:border-slate-600" style={{backgroundColor: color}}></button>
                  ))}
              </div>
              <div className="p-1 border-t border-slate-200 dark:border-slate-600">
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => highlightText('transparent')} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md">
                    <Icons.BanIcon className="w-4 h-4" />
                    Remove Highlight
                </button>
             </div>
          </Dropdown>

          <ToolbarDivider />
          <EditorButton onClick={() => setAlignment('left')} title="Align Left" isActive={activeFormats.textAlign === 'left'}><Icons.AlignLeftIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => setAlignment('center')} title="Align Center" isActive={activeFormats.textAlign === 'center'}><Icons.AlignCenterIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => setAlignment('right')} title="Align Right" isActive={activeFormats.textAlign === 'right'}><Icons.AlignRightIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => setAlignment('justify')} title="Justify" isActive={activeFormats.textAlign === 'justify'}><Icons.AlignJustifyIcon className="w-5 h-5" /></EditorButton>
          <ToolbarDivider />
          <EditorButton onClick={() => executeCommand('insertUnorderedList')} title="Bulleted List" isActive={activeFormats.isUL}><Icons.ListIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => executeCommand('insertOrderedList')} title="Numbered List" isActive={activeFormats.isOL}><Icons.ListOrderedIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => executeCommand('indent')} title="Increase Indent"><Icons.IndentIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => executeCommand('outdent')} title="Decrease Indent"><Icons.OutdentIcon className="w-5 h-5" /></EditorButton>
          <ToolbarDivider />
          <EditorButton onClick={() => toggleBlockType('blockquote')} title="Blockquote" isActive={activeFormats.blockType === 'blockquote'}><Icons.QuoteIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => toggleBlockType('pre')} title="Code Block" isActive={activeFormats.blockType === 'pre'}><Icons.Code2Icon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={(e) => handleOpenPopover(e, 'link')} title="Insert/Edit Link" isActive={activeFormats.isLink}><Icons.LinkIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => executeCommand('unlink')} title="Unlink"><Icons.UnlinkIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => fileInputRef.current?.click()} title="Upload Image"><Icons.UploadCloudIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={(e) => handleOpenPopover(e, 'image')} title="Insert Image from URL"><Icons.ImageIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={(e) => handleOpenPopover(e, 'video')} title="Embed Video"><Icons.VideoIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => executeCommand('insertHorizontalRule')} title="Horizontal Rule"><Icons.MinusIcon className="w-5 h-5" /></EditorButton>
          <ToolbarDivider />
          <EditorButton onClick={() => executeCommand('undo')} title="Undo"><Icons.UndoIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => executeCommand('redo')} title="Redo"><Icons.RedoIcon className="w-5 h-5" /></EditorButton>
          <EditorButton onClick={() => executeCommand('removeFormat')} title="Clear Formatting"><Icons.RemoveFormattingIcon className="w-5 h-5" /></EditorButton>
      </div>
      
      {/* --- Content Area --- */}
      <div className="relative">
        <AnimatePresence>
            {selectionToolbarState.visible && (
                <SelectionToolbar 
                    editorRect={selectionToolbarState.editorRect}
                    selectionRect={selectionToolbarState.selectionRect}
                    handleAiAction={handleAiAction}
                    isLoading={isAiLoading}
                />
            )}
            {popoverState.anchorEl && popoverState.type && (
                <UrlInputPopover
                    anchorEl={popoverState.anchorEl}
                    onClose={handlePopoverClose}
                    onSubmit={handlePopoverSubmit}
                    type={popoverState.type}
                    initialValue={popoverState.initialValue}
                />
            )}
             {selectedImage && (
                <ImageControlPopover
                    popoverRef={imageControlPopoverRef}
                    imageElement={selectedImage}
                    onUpdate={handleImageUpdate}
                    onRemove={handleImageRemove}
                    onClose={() => setSelectedImage(null)}
                />
             )}
        </AnimatePresence>
        <div
            ref={editorRef}
            contentEditable
            onInput={(e) => { onChange(e.currentTarget.innerHTML); }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="prose prose-lg dark:prose-invert max-w-none font-serif p-4 min-h-[400px] outline-none focus:outline-none"
            style={{ whiteSpace: 'pre-wrap' }}
        />
        {isDraggingOver && (
            <div className="absolute inset-0 bg-primary-500/10 backdrop-blur-sm flex items-center justify-center pointer-events-none rounded-md">
            <p className="font-bold text-primary-600 dark:text-primary-300">Drop item here</p>
            </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

// --- Dropdown Components ---

const Dropdown: React.FC<{title: string, value?: string, icon?: React.ReactNode, children: React.ReactNode, isActive?: boolean, isSubmenu?: boolean}> = ({ title, value, icon, children, isActive, isSubmenu }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const buttonClasses = isSubmenu
        ? `flex items-center justify-between w-full px-3 py-1.5 text-sm text-left ${isActive ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'}`
        : `flex items-center gap-1 p-2 rounded-md transition-colors ${isActive ? 'bg-primary-100 text-primary-600 dark:bg-primary-800/50 dark:text-primary-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`;

    const iconRotation = isSubmenu ? 270 : 0;
    
    return (
        <div className="relative" ref={ref} onMouseEnter={isSubmenu ? () => setIsOpen(true) : undefined} onMouseLeave={isSubmenu ? () => setIsOpen(false) : undefined}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} onMouseDown={(e) => e.preventDefault()} className={buttonClasses}>
                {icon || <span className="text-sm font-medium">{value || title}</span>}
                <Icons.ChevronDownIcon className="w-4 h-4" style={{ transform: `rotate(${iconRotation}deg)`}}/>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={`absolute top-full mt-1 z-20 w-max min-w-[150px] bg-white dark:bg-slate-700 rounded-md shadow-lg border border-slate-200 dark:border-slate-600 ${isSubmenu ? 'top-0 left-full ml-1' : ''}`}
                    >
                        <div onClick={isSubmenu ? undefined : () => setIsOpen(false)}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DropdownItem: React.FC<{type?: "button", onClick: () => void, isActive?: boolean, children: React.ReactNode}> = ({ type="button", onClick, isActive, children }) => (
    <button type={type} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`block w-full text-left px-3 py-1.5 text-sm ${isActive ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
        {children}
    </button>
);


export default RichTextEditor;