// src/services/dashboardService.js
import api from './api';

/**
 * Mengambil data statistik utama untuk dashboard.
 * (Total pengguna, total tanah, dll)
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Mengambil data aktivitas terbaru untuk dashboard.
 */
export const getRecentActivities = async () => {
  try {
    const response = await api.get('/recent-activities');
    return response.data.data || response.data; // Handle pagination jika ada
  } catch (error) {
    console.error('Error fetching recent activities:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};