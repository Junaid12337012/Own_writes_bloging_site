import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { MenuIcon, ChevronsLeftIcon, ChevronsRightIcon } from '../icons';
import ThemeToggle from '../ThemeToggle';

const AdminHeader: React.FC<{
  onMobileMenuToggle: () => void;
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
}> = ({ onMobileMenuToggle, isSidebarCollapsed, onSidebarToggle }) => (
  <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-slate-800 px-4 md:px-6">
    <button
      onClick={onMobileMenuToggle}
      className="md:hidden p-2 text-slate-500 rounded-md hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
    >
      <MenuIcon className="h-6 w-6" />
      <span className="sr-only">Open sidebar</span>
    </button>
    <div className="flex-1 flex items-center justify-end gap-4">
       <button
        onClick={onSidebarToggle}
        className="hidden md:block p-2 text-slate-500 rounded-md hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
       >
        {isSidebarCollapsed ? <ChevronsRightIcon className="h-5 w-5" /> : <ChevronsLeftIcon className="h-5 w-5" />}
        <span className="sr-only">Toggle sidebar</span>
      </button>
      <ThemeToggle />
    </div>
  </header>
);

const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950/80 font-sans text-slate-800 dark:text-slate-200">
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out md:pl-${isSidebarCollapsed ? '20' : '64'}`}>
        <AdminHeader 
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onSidebarToggle={() => setIsSidebarCollapsed(prev => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-100 dark:bg-slate-950 overflow-y-auto hide-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;