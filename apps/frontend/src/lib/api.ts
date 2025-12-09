import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

export const attendanceApi = {
  checkIn: (data: { photo?: string; latitude: number; longitude: number; address?: string }) =>
    api.post('/attendance/check-in', data),
  checkOut: (data: { photo?: string; latitude: number; longitude: number; address?: string }) =>
    api.post('/attendance/check-out', data),
  getToday: () => api.get('/attendance/today'),
  getHistory: (page = 1, limit = 10) => api.get(`/attendance?page=${page}&limit=${limit}`),
  getSummary: (year: number, month: number) =>
    api.get(`/attendance/summary?year=${year}&month=${month}`),
  getOfficeLocations: () => api.get('/attendance/office-locations'),
  validateLocation: (latitude: number, longitude: number) =>
    api.post('/attendance/validate-location', { latitude, longitude }),
};

export const aiApi = {
  summarize: (startDate: string, endDate: string) =>
    api.post('/ai/summarize', { startDate, endDate }),
  weeklyReport: (startDate: string, endDate: string) =>
    api.post('/ai/weekly-report', { startDate, endDate }),
  suggestTasks: () => api.get('/ai/suggest-tasks'),
  dailyPrompt: () => api.get('/ai/daily-prompt'),
  reflection: () => api.post('/ai/reflection'),
};

export const activitiesApi = {
  getAll: (page = 1, limit = 10) => api.get(`/activities?page=${page}&limit=${limit}`),
  create: (data: { title: string; description: string; category: string; duration: number; date: string }) =>
    api.post('/activities', data),
  getOne: (id: string) => api.get(`/activities/${id}`),
  delete: (id: string) => api.delete(`/activities/${id}`),
  getAnalytics: (days = 30) => api.get(`/activities/analytics/summary?days=${days}`),
  addAttachment: (activityId: string, data: { fileName: string; fileUrl: string; fileType: string; fileSize: number }) =>
    api.post(`/activities/${activityId}/attachments`, data),
  getAttachments: (activityId: string) => api.get(`/activities/${activityId}/attachments`),
};

export const skillsApi = {
  getAll: () => api.get('/skills'),
  create: (data: { name: string; category: string }) => api.post('/skills', data),
  getMyProgress: () => api.get('/skills/my-progress'),
  getAnalytics: () => api.get('/skills/analytics'),
};

export const badgesApi = {
  getAll: () => api.get('/badges'),
  getMyBadges: () => api.get('/badges/my-badges'),
  checkBadges: () => api.post('/badges/check'),
};

export const moodApi = {
  create: (data: { mood: string; energy: number; notes?: string }) => api.post('/mood', data),
  getHistory: (page = 1, limit = 30) => api.get(`/mood?page=${page}&limit=${limit}`),
  getToday: () => api.get('/mood/today'),
  getAnalytics: (days = 30) => api.get(`/mood/analytics?days=${days}`),
};

export const feedbackApi = {
  create: (data: { activityId: string; receiverId: string; rating?: number; comment: string }) =>
    api.post('/feedback', data),
  getReceived: (page = 1, limit = 10) => api.get(`/feedback/received?page=${page}&limit=${limit}`),
  getGiven: (page = 1, limit = 10) => api.get(`/feedback/given?page=${page}&limit=${limit}`),
  getStats: () => api.get('/feedback/stats'),
};

export const adminApi = {
  getUsers: (page = 1, limit = 10, role?: string) =>
    api.get(`/admin/users?page=${page}&limit=${limit}${role ? `&role=${role}` : ''}`),
  getInterns: (page = 1, limit = 10) => api.get(`/admin/interns?page=${page}&limit=${limit}`),
  getInternDetail: (id: string) => api.get(`/admin/interns/${id}`),
  getStats: () => api.get('/admin/stats'),
  getReports: (page = 1, limit = 10, status?: string) =>
    api.get(`/admin/reports?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`),
  updateUserRole: (userId: string, role: string) => api.patch(`/admin/users/${userId}/role`, { role }),
  assignSupervisor: (internId: string, supervisorId: string) =>
    api.patch(`/admin/interns/${internId}/supervisor`, { supervisorId }),
};

export const usersApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: { name?: string; department?: string; avatarUrl?: string }) =>
    api.patch('/users/me', data),
  getMyInterns: () => api.get('/users/my-interns'),
};

export const supervisorApi = {
  getStats: () => api.get('/supervisor/stats'),
  getMyInterns: () => api.get('/supervisor/interns'),
  getInternDetail: (id: string) => api.get(`/supervisor/interns/${id}`),
  getRecentActivities: () => api.get('/supervisor/activities/recent'),
  getReports: (status?: string) => 
    api.get(`/supervisor/reports${status ? `?status=${status}` : ''}`),
};
