import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { navigationItems } from '../../config/navlinks';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Check if user previously had sidebar open (localStorage)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : true; // Default to true (open)
    }
    return true; // Default to true (open)
  });

  // Get page header based on current route
 const getPageHeader = () => {
  const path = location.pathname;

  if (path === '/') {
    return { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening.' };
  } else if (path === '/users') {
    return { title: 'Users', subtitle: 'Manage user accounts and permissions' };
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
  } 
  // 🔽 New header mappings
  else if (path === '/assign/number') {
    return { title: 'Assign Number', subtitle: 'Assign phone numbers to assistants or users' };
  } else if (path === '/number/lists') {
    return { title: 'Number List', subtitle: 'View and manage all assigned numbers' };
  } else if (path === '/assign/voice') {
    return { title: 'Assign Voice', subtitle: 'Assign voice profiles to your assistants' };
  } else if (path === '/voice/lists') {
    return { title: 'Voice List', subtitle: 'Review and manage all voice configurations' };
  }

  return { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening.' };
};

  const pageHeader = getPageHeader();

  const handleLogout = () => {
    logout();
  };

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
      <div className={`fixed inset-y-0 left-0 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg border-r border-gray-200 transition-all duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0 shadow-xl' : 'lg:translate-x-0'} ${!isSidebarOpen ? 'lg:translate-x-0' : ''} ${isSidebarOpen ? '' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-end h-21 px-4 border-b border-gray-200 bg-white">
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95 group"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
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
                <div className="absolute inset-0 rounded-full bg-gray-300/30 scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
              </div>
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              {isSidebarOpen && (
                <div className="ml-3 min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Admin User'}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email || 'admin@admin.com'}</div>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Super Admin
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                title={!isSidebarOpen ? item.name : ''}
              >
                {({ isActive }) => (
                  <div className={`group flex items-center ${isSidebarOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'} text-sm font-medium rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? 'bg-gray-800 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:scale-105'
                  }`}>
                    <div className={`transition-colors ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {item.icon}
                    </div>
                    {isSidebarOpen && (
                      <span className="ml-3">{item.name}</span>
                    )}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        {item.name}
                      </div>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${isSidebarOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'} text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group relative`}
              title={!isSidebarOpen ? 'Logout' : ''}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isSidebarOpen && <span className="ml-3">Logout</span>}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600/75 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile menu button and Page title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Toggle Menu"
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
                </button>
                {/* Page title */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{pageHeader.title}</h1>
                  <p className="text-sm text-gray-500 hidden sm:block">{pageHeader.subtitle}</p>
                </div>
              </div>
              
              {/* Header actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search */}
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5M10 7A7 7 0 1017 7v3a3 3 0 11-6 0V7z" />
                  </svg>
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* User menu */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</div>
                    <div className="text-xs text-gray-500">Online</div>
                  </div>
                  <div className="relative">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-800 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-700 transition-colors">
                      <span className="text-sm font-semibold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
            <div className="p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

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