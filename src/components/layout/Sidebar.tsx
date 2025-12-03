/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { navigationSections } from '../../config/navigationSections';
import { motion, AnimatePresence } from 'framer-motion';
import { InternetProvider } from '../providers/InternetProvider';
import { useInternetContext } from '../../hooks/useInternetContext';
import { SidebarSection } from './SidebarSection';
import { ProfileDropdown } from './ProfileDropdown';
import { HeaderProfileDropdown } from './HeaderProfileDropdown';

function SidebarContent() {
  const location = useLocation();
  const { isOnline } = useInternetContext();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1024) {
        return false;
      }
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get page header based on current route
  const getPageHeader = () => {
    const path = location.pathname;

    if (path === '/') {
      return { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening.' };
    } else if (path === '/users') {
      return { title: 'Users', subtitle: 'Manage user accounts and permissions' };
    } else if(path === '/user/create'){
      return { title: 'Create User', subtitle: 'Add a new user to the system' };
    } else if (path.startsWith('/users/') && path.includes('/view')) {
      return { title: 'User Details', subtitle: 'View user information and activity' };
    } else if (path.startsWith('/users/') && path.includes('/edit')) {
      return { title: 'Edit User', subtitle: 'Update user information and settings' };
    } else if (path === '/assistant') {
      return { title: 'Assistants', subtitle: 'Manage your AI assistants' };
    } else if (path === '/assistants/create') {
      return { title: 'Create Assistant', subtitle: 'Configure your new AI assistant' };
    } else if (path.startsWith('/assistants/') && path.includes('/view')) {
      return { title: 'Assistant Details', subtitle: 'View assistant configuration' };
    } else if (path.startsWith('/assistants/') && path.includes('/edit')) {
      return { title: 'Edit Assistant', subtitle: 'Update assistant configuration' };
    } else if (path === '/phone-numbers') {
      return { title: 'Buy Phone Number', subtitle: 'Purchase phone number' };
    } else if (path === '/phone-numbers-assign') {
      return { title: 'Assign Phone Number', subtitle: 'Assign purchased numbers to users' };
    } else if (path === '/admin/profile') {
      return { title: 'Admin Profile', subtitle: 'Manage your account settings and preferences' };
    }

    return { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening.' };
  };

  const pageHeader = getPageHeader();

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    }
  };

  // Get sidebar width based on screen size and state
  const getSidebarWidth = () => {
    if (windowWidth >= 1280) { // xl screens
      return isSidebarOpen ? 280 : 88;
    } else if (windowWidth >= 1024) { // lg screens
      return isSidebarOpen ? 256 : 80;
    } else if (windowWidth >= 768) { // md screens
      return isSidebarOpen ? 240 : 72;
    } else if (windowWidth >= 640) { // sm screens
      return isSidebarOpen ? 220 : 64;
    } else { // mobile
      return isSidebarOpen ? 200 : 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        className="fixed top-0 left-0 z-50 h-screen bg-white shadow-lg border-r border-gray-200 lg:z-30 lg:translate-x-0"
        initial={false}
        animate={{ 
          width: getSidebarWidth(),
          x: windowWidth >= 1024 ? 0 : (isSidebarOpen ? 0 : -getSidebarWidth())
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        style={{
          visibility: windowWidth < 1024 && !isSidebarOpen ? 'hidden' : 'visible',
          overflow: 'hidden'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle Header */}
          <motion.div 
            className="flex items-center justify-between h-16 sm:h-18 lg:h-20 px-2 sm:px-3 lg:px-4 border-b border-gray-200 bg-white shrink-0"
            initial={false}
            animate={{ opacity: 1 }}
          >
            {/* Logo */}
            <AnimatePresence mode="wait">
              {isSidebarOpen ? (
                <motion.div 
                  key="logo-open"
                  className="flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.img 
                    src="/logo.svg" 
                    alt="Aloqa AI Logo" 
                    className="h-12 sm:h-16 lg:h-20 w-20 sm:w-25 lg:w-30 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </motion.div>
              ) : (
                windowWidth >= 1024 && (
                  <img 
                    key="logo-closed"
                    src="/logo.png" 
                    alt="Logo" 
                    className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 object-contain mx-auto transition-opacity duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )
              )}
            </AnimatePresence>
            
            {/* Toggle Button */}
            <motion.button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <div className="relative w-5 h-5">
                {isSidebarOpen ? (
                  <svg 
                    className="w-5 h-5 transition-colors duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
                    />
                  </svg>
                ) : (
                  <svg 
                    className="w-5 h-5 transition-colors duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M13 5l7 7-7 7M5 5l7 7-7 7" 
                    />
                  </svg>
                )}
                <div 
                  className="absolute inset-0 rounded-full bg-green-300/30 opacity-0 hover:opacity-100 transition-opacity"
                ></div>
              </div>
            </motion.button>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col px-2 py-3 overflow-y-auto">
            <div className="space-y-1 flex-1">
              {navigationSections.map((section: any, index: number) => {
                const isActive = section.children 
                  ? section.children.some((child: any) => location.pathname === child.href)
                  : location.pathname === section.href;

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                  >
                    <SidebarSection
                      section={section}
                      isCollapsed={!isSidebarOpen}
                      isActive={isActive}
                      onMobileClick={() => {
                        if (windowWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Profile Dropdown at Bottom */}
            <motion.div
              className="mt-4 pt-4 border-t border-gray-200 shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ProfileDropdown isCollapsed={!isSidebarOpen} />
            </motion.div>
          </nav>
        </div>
      </motion.div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden bg-gray-600/75 backdrop-blur-sm"
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
        initial={false}
        animate={{ 
          marginLeft: windowWidth >= 1024 ? getSidebarWidth() : 0
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {/* Header */}
        <motion.header 
          className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 z-40 h-16 sm:h-18 lg:h-20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            left: windowWidth >= 1024 ? `${getSidebarWidth()}px` : '0'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6 xl:px-8">
            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={toggleSidebar}
              className="lg:hidden flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>

            {/* Page Header */}
            <motion.div 
              className="flex-1 lg:flex-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-left lg:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {pageHeader.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-0.5 lg:mt-1">
                  {pageHeader.subtitle}
                </p>
              </div>
            </motion.div>

            {/* Right side content */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Internet Status */}
              <div 
                className={`flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isOnline 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="hidden sm:inline">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Notifications */}
              <button 
                className="relative p-1.5 sm:p-2 text-gray-400 hover:text-[#5DD149] hover:bg-green-50 rounded-lg transition-colors"
              >
                <svg 
                  className="h-5 w-5 sm:h-6 sm:w-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span 
                  className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-2 w-2 bg-red-500 rounded-full"
                ></span>
              </button>

              {/* Profile Dropdown */}
              <HeaderProfileDropdown />
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <motion.main 
          className="flex-1 min-w-0 overflow-auto pt-16 sm:pt-18 lg:pt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div 
            className="bg-white min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-200px)] rounded-lg lg:rounded-xl m-3 sm:m-4 lg:m-6 xl:m-8 overflow-hidden"
          >
            <div className="p-3 sm:p-4 lg:p-6 xl:p-8 overflow-y-auto overflow-x-hidden h-full">
              <Outlet />
            </div>
          </div>
        </motion.main>
      </motion.div>
    </div>
  );
}

export function Sidebar() {
  return (
    <InternetProvider>
      <SidebarContent />
    </InternetProvider>
  );
}