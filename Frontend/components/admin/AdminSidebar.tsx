import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion as motionTyped, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboardIcon,
  FileTextIcon,
  FolderIcon,
  SettingsIcon,
  UsersRound,
  BookTextIcon,
  MessageSquareText,
  MailIcon,
  XIcon,
  PenLineIcon,
  ExternalLinkIcon,
  UsersIcon,
  PenSquareIcon
} from '../icons';
import { useData } from '../../hooks/useData';

interface AdminSidebarProps {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
}

const motion = motionTyped as any;

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string, isCollapsed: boolean, onClick?: () => void }> = ({ to, icon, label, isCollapsed, onClick }) => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center py-2.5 text-sm font-medium rounded-lg transition-colors group relative ${
        isCollapsed ? 'justify-center px-3' : 'px-4'
    } ${
      isActive
        ? 'bg-primary-500 text-white'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`;
    
    return (
        <NavLink to={to} end className={navLinkClass} onClick={onClick}>
            <div className="flex-shrink-0">{icon}</div>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0' : 'w-auto ml-3'}`}>{label}</span>
            {isCollapsed && (
                 <span className="absolute left-full w-max px-2 py-1 text-xs text-white bg-slate-800 dark:bg-slate-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-3 z-20 pointer-events-none">{label}</span>
            )}
        </NavLink>
    )
}

const SidebarContent: React.FC<{ isCollapsed: boolean, onLinkClick: () => void }> = ({ isCollapsed, onLinkClick }) => {
    const { siteSettings } = useData();
    const navItems = [
        { to: "/admin", icon: <LayoutDashboardIcon className="w-5 h-5" />, label: "Dashboard" },
        { to: "/admin/posts", icon: <FileTextIcon className="w-5 h-5" />, label: "Posts" },
        { to: "/admin/pages", icon: <BookTextIcon className="w-5 h-5" />, label: "Pages" },
        { to: "/admin/snippets", icon: <PenSquareIcon className="w-5 h-5" />, label: "Snippets" },
        { to: "/admin/categories", icon: <FolderIcon className="w-5 h-5" />, label: "Categories" },
        { to: "/admin/comments", icon: <MessageSquareText className="w-5 h-5" />, label: "Comments" },
        { to: "/admin/messages", icon: <MailIcon className="w-5 h-5" />, label: "Messages" },
        { to: "/admin/subscribers", icon: <UsersIcon className="w-5 h-5" />, label: "Subscribers" },
        { to: "/admin/authors", icon: <PenLineIcon className="w-5 h-5" />, label: "Authors" },
        { to: "/admin/users", icon: <UsersRound className="w-5 h-5" />, label: "Users" },
    ];
    return (
        <>
            <div className={`h-16 flex items-center border-b border-slate-200 dark:border-slate-700 transition-all duration-300 overflow-hidden ${isCollapsed ? 'justify-center' : 'px-4'}`}>
                <Link to="/admin" className="font-bold font-serif text-primary-600 dark:text-primary-400 text-xl whitespace-nowrap">
                    {isCollapsed ? siteSettings.title.charAt(0) : siteSettings.title}
                </Link>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto hide-scrollbar">
                {navItems.map(item => (
                    <NavItem key={item.to} {...item} isCollapsed={isCollapsed} onClick={onLinkClick} />
                ))}
            </nav>
            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                <NavItem to="/admin/settings" icon={<SettingsIcon className="w-5 h-5" />} label="Settings" isCollapsed={isCollapsed} onClick={onLinkClick} />
                <NavItem to="/" icon={<ExternalLinkIcon className="w-5 h-5" />} label="View Site" isCollapsed={isCollapsed} onClick={onLinkClick} />
            </div>
        </>
    )
};

const SidebarDesktop: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
    <aside className={`hidden md:flex flex-col fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <SidebarContent isCollapsed={isCollapsed} onLinkClick={() => {}} />
    </aside>
);

const SidebarMobile: React.FC<{ setIsMobileOpen: (isOpen: boolean) => void }> = ({ setIsMobileOpen }) => (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
        onClick={() => setIsMobileOpen(false)}
      />
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-800 z-[60] flex flex-col md:hidden"
      >
        <SidebarContent isCollapsed={false} onLinkClick={() => setIsMobileOpen(false)} />
      </motion.div>
    </>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
      <SidebarDesktop isCollapsed={isCollapsed} />
      <AnimatePresence>
        {isMobileOpen && <SidebarMobile setIsMobileOpen={setIsMobileOpen} />}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;