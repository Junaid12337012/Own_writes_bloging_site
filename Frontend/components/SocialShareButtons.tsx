import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShareIcon, TwitterIcon, FacebookIcon, LinkedinIcon, LinkIcon, CheckIcon } from './icons';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ 
  url, 
  title, 
  description = '', 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: <TwitterIcon className="w-5 h-5" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-blue-500 hover:text-white',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon className="w-5 h-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600 hover:text-white',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinIcon className="w-5 h-5" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-700 hover:text-white',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShareIcon className="w-4 h-4 mr-2" />
        Share
      </motion.button>

      {/* Share Options */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-3 z-50 min-w-[200px]"
        >
          <div className="space-y-2">
            {shareLinks.map((link) => (
              <motion.button
                key={link.name}
                onClick={() => handleShare(link.url)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${link.bgColor} ${link.color} text-slate-700 dark:text-slate-300`}
                whileHover={{ x: 4 }}
              >
                {link.icon}
                <span className="ml-3 font-medium">{link.name}</span>
              </motion.button>
            ))}
            
            {/* Copy Link Button */}
            <motion.button
              onClick={handleCopyLink}
              className="w-full flex items-center px-3 py-2 rounded-md text-left transition-colors bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              whileHover={{ x: 4 }}
            >
              {copied ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
              ) : (
                <LinkIcon className="w-5 h-5" />
              )}
              <span className="ml-3 font-medium">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </motion.button>

            {/* Native Share (if supported) */}
            {navigator.share && (
              <motion.button
                onClick={handleNativeShare}
                className="w-full flex items-center px-3 py-2 rounded-md text-left transition-colors bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                whileHover={{ x: 4 }}
              >
                <ShareIcon className="w-5 h-5" />
                <span className="ml-3 font-medium">More Options</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Backdrop to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SocialShareButtons;
