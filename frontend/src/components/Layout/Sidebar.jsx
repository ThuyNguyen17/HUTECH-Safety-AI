// src/components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CameraIcon,
  BellAlertIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  BeakerIcon,
  InformationCircleIcon,
  ChartBarIcon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Cameras', path: '/cameras', icon: CameraIcon, badge: 4 },
  { name: 'Alerts', path: '/alerts', icon: BellAlertIcon, badge: 3 },
  { name: 'Analytics', path: '/analytics', icon: ChartBarIcon },
  { name: 'Testing', path: '/testing/model', icon: BeakerIcon },
  { name: 'Admin Panel', path: '/admin', icon: UserGroupIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  { name: 'Documentation', path: '/info/docs', icon: InformationCircleIcon },
];

const Sidebar = ({ onClose }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="w-64 h-full bg-white border-r shadow-xl flex flex-col">
      {/* Mobile close button with animation */}
      <div className="lg:hidden flex justify-end p-4 border-b">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
        >
          <XMarkIcon className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      
      {/* Navigation with hover effects */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div className="px-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Main Navigation
          </h3>
        </div>
        
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredItem === item.name;
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent'
                  }`
                }
                end
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                  {isHovered && !item.badge && (
                    <ChevronRightIcon className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 opacity-70" />
                  )}
                </div>
                <span className="flex-1 transition-all duration-200 group-hover:translate-x-1">{item.name}</span>
                {item.badge && (
                  <span className="bg-gradient-to-r from-red-100 to-red-50 text-red-800 text-xs px-2 py-1 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Camera Status Section with animations */}
        <div className="mt-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Camera Status
            </h3>
            <span className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer transition-colors">
              View All
            </span>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Front Gate', status: 'online', location: 'Main Entrance' },
              { name: 'Lobby', status: 'online', location: 'Building A' },
              { name: 'Parking Lot', status: 'offline', location: 'Level B2' },
              { name: 'Back Entrance', status: 'error', location: 'Service Area' },
              { name: 'Server Room', status: 'online', location: 'Floor 3' },
              { name: 'Reception', status: 'online', location: 'Ground Floor' },
            ].map((camera, index) => (
              <div 
                key={camera.name}
                className="group p-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent hover:border-gray-200"
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="relative mt-1">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        camera.status === 'online' ? 'bg-green-500' :
                        camera.status === 'offline' ? 'bg-gray-400' :
                        'bg-red-500'
                      }`} />
                      {camera.status === 'online' && (
                        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-800 group-hover:text-gray-900 transition-colors">
                        {camera.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{camera.location}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 transform group-hover:scale-105 ${
                    camera.status === 'online' ? 'bg-green-50 text-green-700 group-hover:bg-green-100' :
                    camera.status === 'offline' ? 'bg-gray-50 text-gray-700 group-hover:bg-gray-100' :
                    'bg-red-50 text-red-700 group-hover:bg-red-100'
                  }`}>
                    {camera.status.charAt(0).toUpperCase() + camera.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 px-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { time: '2 min ago', event: 'Motion detected at Front Gate', type: 'alert' },
              { time: '15 min ago', event: 'Camera 3 back online', type: 'success' },
              { time: '1 hour ago', event: 'System backup completed', type: 'info' },
            ].map((activity, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  activity.type === 'alert' ? 'bg-red-500' :
                  activity.type === 'success' ? 'bg-green-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.event}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles inline */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #d1d5db 0%, #9ca3af 100%);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9ca3af 0%, #6b7280 100%);
          width: 8px;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
        
        .custom-scrollbar:hover {
          scrollbar-color: #9ca3af transparent;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;