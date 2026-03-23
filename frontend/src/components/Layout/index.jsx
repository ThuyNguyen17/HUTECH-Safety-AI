// src/components/Layout/index.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setSidebarOpen(false); // Auto close on mobile
      } else {
        setSidebarOpen(true); // Auto open on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onToggleSidebar={toggleSidebar} 
        isSidebarOpen={sidebarOpen}
      />
      
      <div className="flex pt-16">
        {/* Desktop Sidebar - Fixed with smooth transition */}
        <div className={`
          hidden lg:block fixed left-0 top-16 bottom-0 z-30
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}
        `}>
          <div className="w-64 h-full">
            <Sidebar />
          </div>
        </div>
        
        {/* Mobile Sidebar - Slide in from left */}
        <div className={`
          lg:hidden fixed inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="w-64 h-full">
            <Sidebar onClose={closeSidebar} />
          </div>
        </div>
        
        {/* Mobile Overlay - Fade in/out */}
        {sidebarOpen && isMobile && (
          <div 
            className={`
              fixed inset-0 bg-black z-30 lg:hidden
              transition-opacity duration-300 ease-in-out
              ${sidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}
            `}
            onClick={closeSidebar}
          />
        )}
        
        {/* Main Content - Smooth margin transition */}
        <main className={`
          flex-1 w-full min-h-[calc(100vh-4rem)]
          transition-all duration-300 ease-in-out
          ${sidebarOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-0'}
        `}>
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;