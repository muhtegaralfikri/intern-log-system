import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
