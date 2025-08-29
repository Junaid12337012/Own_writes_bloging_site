import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
    SearchIcon, BookmarkIcon, UserIcon, LogOutIcon, 
    PenSquareIcon, LayoutDashboardIcon, FolderIcon, 
    MailIcon, CompassIcon, InfoIcon, ChevronDownIcon, ImageIcon, SparklesIcon,
    InkwellLogo, MenuIcon, XIcon
} from './icons';
import { useBookmarks } from '../contexts/BookmarksContext';
import { motion as motionTyped, AnimatePresence } from 'framer-motion';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import SearchModal from './SearchModal';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';

const motion = motionTyped as any;

const BookmarkNavLink: React.FC = () => {
    const { bookmarkedPosts } = useBookmarks();
    const bookmarkCount = bookmarkedPosts.length;
    
    return (
        <Link to="/saved" className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
            <div className="flex items-center">
                <BookmarkIcon className="w-5 h-5 mr-3" />
                <span>Bookmarks</span>
            </div>
            {bookmarkCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                    {bookmarkCount}
                </span>
            )}
        </Link>
    );
};

const BookmarkHeaderButton: React.FC = () => {
    const { bookmarkedPosts } = useBookmarks();
    const bookmarkCount = bookmarkedPosts.length;
    
    return (
        <Link 
            to="/saved" 
            className="relative p-2 rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label={`Bookmarks${bookmarkCount > 0 ? ` (${bookmarkCount})` : ''}`}
        >
            <BookmarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-primary-600 rounded-full min-w-[18px] h-[18px]">
                    {bookmarkCount > 99 ? '99+' : bookmarkCount}
                </span>
            )}
        </Link>
    );
};

const ProfileDropdown: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-zinc-950"
            >
                <img src={user.avatarUrl} className="w-10 h-10 rounded-full" alt={user.name} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-64 origin-top-right rounded-md shadow-lg bg-white dark:bg-zinc-800 ring-1 ring-black ring-opacity-5 dark:ring-zinc-700 focus:outline-none"
                    >
                        <div className="py-1">
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-zinc-400 truncate">{user.email}</p>
                            </div>
                            <div className="py-1">
                                {user.isAdmin && (
                                    <Link to="/admin/posts/new" className="md:hidden flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
                                        <PenSquareIcon className="w-5 h-5 mr-3" />
                                        <span>Write</span>
                                    </Link>
                                )}
                                <BookmarkNavLink />
                                {user.isAdmin && (
                                     <Link to="/admin" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
                                        <LayoutDashboardIcon className="w-5 h-5 mr-3" />
                                        <span>Admin</span>
                                    </Link>
                                )}
                            </div>
                             <div className="border-t border-gray-200 dark:border-zinc-700 py-1">
                                <button
                                    onClick={() => { onLogout(); setIsOpen(false); }}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                >
                                    <LogOutIcon className="w-5 h-5 mr-3" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Header: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiToolsOpen, setIsAiToolsOpen] = useState(false);
  const aiToolsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { siteSettings } = useData();
  const { user, logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isSearchModalOpen || isMobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; }
  }, [isSearchModalOpen, isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (aiToolsRef.current && !aiToolsRef.current.contains(event.target as Node)) {
            setIsAiToolsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
    const navLinks = [
        { to: '/categories', label: 'Categories' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ];
    
    const aiTools = [
        { to: '/story-writer', label: 'Story Writer', icon: <PenSquareIcon className="w-5 h-5 mr-3"/> },
        { to: '/vision-weaver', label: 'Vision Weaver', icon: <ImageIcon className="w-5 h-5 mr-3"/> },
        { to: '/pathfinder', label: 'Pathfinder', icon: <CompassIcon className="w-5 h-5 mr-3"/> },
    ];

  return (
    <>
      <motion.header
        initial={{ y: -65 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-30 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-zinc-700/50"
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Left: Logo */}
            <div className="flex-shrink-0 min-w-0">
                <Link to="/" className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold font-serif text-gray-900 dark:text-white">
                    <div className="block dark:hidden">
                        {siteSettings.logoLightUrl ? (
                            <img key={siteSettings.logoLightUrl} src={siteSettings.logoLightUrl} alt={`${siteSettings.title} Logo`} className="h-7 sm:h-8 md:h-10 lg:max-h-12 w-auto" />
                        ) : (
                            <InkwellLogo title={siteSettings.title} className="h-6 sm:h-7 md:h-8 w-auto" />
                        )}
                    </div>
                    <div className="hidden dark:block">
                        {siteSettings.logoDarkUrl ? (
                                <img key={siteSettings.logoDarkUrl} src={siteSettings.logoDarkUrl} alt={`${siteSettings.title} Logo`} className="h-7 sm:h-8 md:h-10 lg:max-h-12 w-auto" />
                        ) : siteSettings.logoLightUrl ? (
                                <img key={siteSettings.logoLightUrl} src={siteSettings.logoLightUrl} alt={`${siteSettings.title} Logo`} className="h-7 sm:h-8 md:h-10 lg:max-h-12 w-auto" />
                        ) : (
                                <InkwellLogo title={siteSettings.title} className="h-6 sm:h-7 md:h-8 w-auto" />
                        )}
                    </div>
                </Link>
            </div>
            
            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex flex-1 justify-center mx-8">
                <nav className="flex items-center space-x-2 xl:space-x-8">
                    {navLinks.map((link) => (
                        <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-white whitespace-nowrap ${
                            isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400'
                            }`
                        }
                        >
                        {link.label}
                        </NavLink>
                    ))}
                    <div className="relative" ref={aiToolsRef}>
                        <button onClick={() => setIsAiToolsOpen(!isAiToolsOpen)} className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">
                            <SparklesIcon className="w-4 h-4" />
                            <span>AI Tools</span>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isAiToolsOpen ? 'rotate-180' : ''}`} />
                        </button>
                            <AnimatePresence>
                            {isAiToolsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 origin-top rounded-md shadow-lg bg-white dark:bg-zinc-800 ring-1 ring-black ring-opacity-5 dark:ring-zinc-700 z-10"
                                >
                                    <div className="py-1">
                                        {aiTools.map((tool) => (
                                            <Link
                                                key={tool.to}
                                                to={tool.to}
                                                onClick={() => setIsAiToolsOpen(false)}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                            >
                                                {React.cloneElement(tool.icon, { className: 'w-5 h-5 mr-3 text-gray-500 dark:text-zinc-400' })}
                                                <span>{tool.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end flex-shrink-0">
                <div className="flex items-center space-x-1 sm:space-x-2">

                    {user && user.isAdmin && (
                        <Link to="/admin/posts/new" className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                            <PenSquareIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Write</span>
                        </Link>
                    )}
                
                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>
                
                    {user ? (
                        <ProfileDropdown onLogout={handleLogout} />
                    ) : (
                        <>
                            <Link to="/login" className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                Sign in
                            </Link>
                            <Link to="/signup" className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-50 dark:text-gray-900 rounded-full hover:bg-gray-900 dark:hover:bg-white transition-colors">
                                Get started
                            </Link>
                        </>
                    )}

                    <div className="sm:hidden">
                        <ThemeToggle />
                    </div>

                    <div className="lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-1 text-gray-500 dark:text-zinc-400" aria-label="Open menu">
                            <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </motion.header>

        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-xs bg-white dark:bg-zinc-950 shadow-lg flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-zinc-800">
                             <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 sm:gap-2 text-lg sm:text-xl font-bold font-serif text-gray-900 dark:text-white">
                                <InkwellLogo title={siteSettings.title} className="h-6 sm:h-auto w-auto" />
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-1 sm:-mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" aria-label="Close menu">
                                <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>
                        <nav className="p-3 sm:p-4 flex flex-col flex-grow overflow-y-auto">
                            <ul className="space-y-1 sm:space-y-2">
                                {navLinks.map(link => (
                                    <li key={link.to}>
                                        <NavLink to={link.to} onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `block px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800' : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>
                                            {link.label}
                                        </NavLink>
                                    </li>
                                ))}
                                <li>
                                    <button 
                                        onClick={() => { setIsSearchModalOpen(true); setIsMobileMenuOpen(false); }}
                                        className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-base font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <SearchIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-zinc-400" />
                                        Search
                                    </button>
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-800">
                                <h3 className="px-3 sm:px-4 mb-3 text-xs sm:text-sm font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                    <SparklesIcon className="w-4 h-4" />
                                    AI Tools
                                </h3>
                                <ul className="space-y-1">
                                    {aiTools.map(tool => (
                                        <li key={tool.to}>
                                            <NavLink to={tool.to} onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800' : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>
                                                {React.cloneElement(tool.icon, { className: 'w-5 h-5 mr-3 text-gray-500 dark:text-zinc-400' })}
                                                <span>{tool.label}</span>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {!user && (
                                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-zinc-800 space-y-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                                        Sign in
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-gray-800 dark:bg-gray-50 dark:text-gray-900 rounded-full hover:bg-gray-900 dark:hover:bg-white transition-colors">
                                        Get started
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  );
};

export default Header;