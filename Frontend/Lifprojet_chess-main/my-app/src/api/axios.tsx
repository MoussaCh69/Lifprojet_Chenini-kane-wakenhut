import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000/api/user',
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            config.headers['auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
