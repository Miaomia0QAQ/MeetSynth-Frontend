import axios, { AxiosResponse } from 'axios';
// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
});

// 请求拦截器（可添加 token）
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// 响应拦截器（统一处理 Result 结构）
request.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data;
    },
    (error) => {
      // 处理网络错误（如 500、404）
      console.error('网络错误:', error.message);
      return Promise.reject(error);
    }
  );

export default request