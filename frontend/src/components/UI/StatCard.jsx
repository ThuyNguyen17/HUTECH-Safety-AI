// src/components/UI/StatCard.jsx
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  variant = 'primary', 
  trend = 'neutral',
  description 
}) => {
  const variants = {
    primary: 'from-blue-500 to-blue-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
  };
  
  const bgVariants = {
    primary: 'bg-blue-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
  };
  
  const textVariants = {
    primary: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          
          {change && (
            <div className="flex items-center">
              {trend === 'up' ? (
                <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-lg text-sm">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  {change}
                </div>
              ) : trend === 'down' ? (
                <div className="flex items-center bg-red-50 text-red-700 px-2 py-1 rounded-lg text-sm">
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                  {change}
                </div>
              ) : (
                <span className="text-sm text-gray-600">{change}</span>
              )}
            </div>
          )}
          
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${variants[variant]}`}>
            <div className="text-white">
              {React.cloneElement(icon, { className: 'w-6 h-6' })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;