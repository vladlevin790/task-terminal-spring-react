import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data || 
                        error.message || 
                        'An unexpected error occurred';
    
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage
    });
  }
);

export const todoApi = {
  getAll: () => api.get('/todos'),
  getById: (id) => api.get(`/todos/${id}`),
  create: (todo) => api.post('/todos', todo),
  update: (id, todo) => api.put(`/todos/${id}`, todo),
  delete: (id) => api.delete(`/todos/${id}`),
  toggleComplete: (id) => api.patch(`/todos/${id}/complete`)
};

export const authApi = {
  register: (userData) => {
    console.log('Sending registration request:', userData);
    return api.post('/auth/register', userData);
  },
  verify: (verificationData) => {
    console.log('Sending verification request:', verificationData);
    return api.post('/auth/verify', verificationData);
  },
  login: (credentials) => {
    console.log('Sending login request:', credentials);
    return api.post('/auth/login', credentials);
  }
};

export default api;
