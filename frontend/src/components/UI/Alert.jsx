// src/components/UI/Alert.jsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Alert = ({ 
  children, 
  variant = 'info', 
  className = '', 
  onClose,
  title 
}) => {
  const variants = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };
  
  return (
    <div className={`${variants[variant]} border rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 -mt-1 -mr-2 p-1 rounded hover:bg-black/10"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;