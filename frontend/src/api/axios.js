import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('findit_user');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (_) {}
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Auto logout on 401
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        localStorage.removeItem('findit_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
