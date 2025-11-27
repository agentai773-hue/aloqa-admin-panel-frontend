import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router';
import { navigationItems } from '../../config/navlinks';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Check if user previously had sidebar open (localStorage)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : true; // Default to true (open)
    }
    return true; // Default to true (open)
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileDropdown(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get page header based on current route
 const getPageHeader = () => {
  const path = location.pathname;

  if (path === '/') {
    return { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening.' };
  } else if (path === '/users') {
    return { title: 'Users', subtitle: 'Manage user accounts and permissions' };
  } else if(path === '/user/create'){
    return { title: 'Create User', subtitle: 'Add a new user to the system' };
  }if (path.startsWith('/users/') && path.includes('/view')) {
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
    // Save sidebar state to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg border-r border-gray-200`}
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 256 : 80,
          x: 0
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle Header */}
          <motion.div 
            className="flex items-center justify-between h-20 px-4 border-b border-gray-200 bg-white"
            initial={false}
            animate={{ opacity: 1 }}
          >
            {/* Logo */}
            <AnimatePresence mode="wait">
              {isSidebarOpen ? (
                <motion.div 
                  key="logo-open"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.img 
                    src="/logo.svg" 
                    alt="Aloqa AI Logo" 
                    className="h-20 w-30 object-contain"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </motion.div>
              ) : (
                <motion.img 
                  key="logo-closed"
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-10 w-10 object-contain mx-auto"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </AnimatePresence>
            
            {/* Toggle Button */}
            <motion.button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative w-5 h-5">
                {isSidebarOpen ? (
                  <svg 
                    className="w-5 h-5 transition-all duration-300 group-hover:scale-110" 
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
                    className="w-5 h-5 transition-all duration-300 group-hover:scale-110" 
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
                {/* Pulse effect on hover */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-green-300/30"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.5, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>
            </motion.button>
          </motion.div>

     

          {/* Navigation */}
          <nav className="flex-1 flex flex-col px-3 py-6">
            <div className="space-y-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                >
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  {({ isActive }) => (
                    <motion.div 
                      className={`group flex items-center ${isSidebarOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'} text-sm font-medium rounded-xl relative ${
                        isActive
                          ? 'text-white shadow-lg shadow-green-500/30'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-green-50'
                      }`}
                      style={isActive ? {
                        background: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)'
                      } : {}}
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div 
                        className={`transition-colors ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-[#5DD149]'}`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span 
                            className="ml-3"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {!isSidebarOpen && (
                        <motion.div 
                          className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg"
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </NavLink>
                </motion.div>
              ))}
            </div>

            {/* Logout Button at Bottom */}
            <motion.div
              className="mt-auto pt-4 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={handleLogout}
                title={!isSidebarOpen ? 'Logout' : ''}
                className={`group flex items-center w-full ${isSidebarOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'} text-sm font-medium rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors`}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div 
                  className="transition-colors"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </motion.div>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      className="ml-3"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isSidebarOpen && (
                  <motion.div 
                    className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Logout
                  </motion.div>
                )}
              </motion.button>
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
        className="flex-1 flex flex-col"
        initial={false}
        animate={{ 
          marginLeft: isSidebarOpen ? 256 : 80 
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {/* Header */}
        <motion.header 
          className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile menu button and Page title */}
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  title="Toggle Menu"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    {isSidebarOpen ? (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    ) : (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M4 6h16M4 12h16M4 18h16" 
                      />
                    )}
                  </svg>
                </motion.button>
                {/* Page title */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  <motion.h1 
                    className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent" 
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #5DD149 0%, #306B25 100%)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {pageHeader.title}
                  </motion.h1>
                  <motion.p 
                    className="text-sm text-gray-500 hidden sm:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {pageHeader.subtitle}
                  </motion.p>
                </motion.div>
              </div>
              
              {/* Header actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Notifications */}
                <motion.button 
                  className="relative p-2 text-gray-400 hover:text-[#5DD149] hover:bg-green-50 rounded-lg"
                  whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.svg 
                    className="h-6 w-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ scale: 1.1 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </motion.svg>
                  <motion.span 
                    className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  ></motion.span>
                </motion.button>
                
                {/* Admin label */}
                <div className="relative" ref={dropdownRef}>
                  <motion.div 
                    className="flex items-center space-x-3 cursor-pointer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <div className="hidden sm:block text-right">
                      <div className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</div>
                      <div className="text-xs text-gray-500">Online</div>
                    </div>
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-700 transition-colors">
                        <span className="text-sm font-semibold text-white">
                          {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <motion.div 
                        className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 rounded-full border-2 border-white"
                        animate={{ scale: [1, 1.2] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      ></motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div className="py-1">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <div className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</div>
                            <div className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</div>
                          </div>
                          <button
                            onClick={() => {
                              navigate('/admin/profile');
                              setShowProfileDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile</span>
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main 
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <motion.div 
            className="bg-white min-h-[calc(100vh-200px)]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="p-6 lg:p-8">
              <Outlet />
            </div>
          </motion.div>
        </motion.main>
      </motion.div>

      {/* Floating Toggle Button for Collapsed Sidebar */}
 

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}