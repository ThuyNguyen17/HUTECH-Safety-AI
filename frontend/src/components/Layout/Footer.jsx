// src/components/Layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} VisionGuard Security System. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a href="/privacy" className="text-gray-500 hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-500 hover:text-gray-700">
              Terms of Service
            </a>
            <a href="/support" className="text-gray-500 hover:text-gray-700">
              Support
            </a>
            <div className="text-gray-400">
              v1.0.0 • Last updated: Today
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;