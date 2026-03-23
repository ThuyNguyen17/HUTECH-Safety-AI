// src/components/Layout/Header.jsx
import React from 'react';
import { BellIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b shadow-sm fixed top-0 left-0 right-0 h-16 z-40">
      <div className="px-4 md:px-6 h-full flex items-center justify-between">
        {/* Left section: toggle + logo */}
        <div className="flex items-center space-x-4">
          {/* Toggle button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <div className="relative w-6 h-6">
              <Bars3Icon
                className={`absolute w-6 h-6 text-gray-600 transition-all duration-300 ${
                  isSidebarOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                }`}
                aria-hidden="true"
              />
              <XMarkIcon
                className={`absolute w-6 h-6 text-gray-600 transition-all duration-300 ${
                  isSidebarOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                }`}
                aria-hidden="true"
              />
            </div>
          </button>

          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transition-transform hover:scale-105 duration-200">
              <CameraIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">VisionGuard</h1>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CameraIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">VisionGuard</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search cameras, alerts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group">
            <BellIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              3
            </span>
          </button>

          {/* User profile */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-800">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-200">
                <span className="font-semibold text-white text-sm">
                  {user.displayName
                    ? user.displayName[0].toUpperCase()
                    : user.email[0].toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const CameraIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
  </svg>
);

export default Header;
