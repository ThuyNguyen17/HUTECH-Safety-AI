// src/hooks/useAlerts.js
import { useState, useEffect } from 'react';
import { mockAlerts } from '../data/mockData';

export const useAlerts = (filters = {}) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter alerts based on provided filters
      let filteredAlerts = [...mockAlerts];
      
      if (filters.severity) {
        filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity);
      }
      
      if (filters.cameraId) {
        filteredAlerts = filteredAlerts.filter(alert => alert.cameraId === filters.cameraId);
      }
      
      setAlerts(filteredAlerts);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu cảnh báo');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockStats = {
        totalToday: 12,
        criticalToday: 3,
        responseRate: 95.5,
        preventedCases: 42,
        avgResponseTime: '1.8 min'
      };
      
      setStats(mockStats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setAlerts(prevAlerts => 
        prevAlerts.filter(alert => alert.id !== alertId)
      );
      
      return { success: true, message: 'Đã xác nhận cảnh báo' };
    } catch (err) {
      return { success: false, message: 'Không thể xác nhận cảnh báo' };
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchStats();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchAlerts();
      fetchStats();
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  return {
    alerts,
    loading,
    error,
    stats,
    refetch: fetchAlerts,
    acknowledgeAlert,
  };
};