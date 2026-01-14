import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // 配合 Vite 代理或真实地址
  timeout: 10000,
});

// 请求拦截器：自动加 Token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一处理报错
instance.interceptors.response.use(
        (response) => response.data, // 直接返回 data，类似后端 Result.data
        (error) => {
          if (error.response?.status === 401) {
            // Token 过期，跳转登录
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
);

export default instance;
