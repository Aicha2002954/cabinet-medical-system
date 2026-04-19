import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8087', // Gateway مباشر
});

api.interceptors.request.use(
    (config) => {
        // لا نضيف التوكن لطلب login
        if (config.url !== '/v1/users/login') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;