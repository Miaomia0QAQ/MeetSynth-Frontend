import axios, { AxiosResponse } from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Token = token;
  }
  return config;
});

request.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('响应数据:', response);
    return response.data;
  },
  (error) => {
    console.log('请求错误:', error);
    if (error.response) {
      console.log('请求错误:', error.response);
      // 处理 403 错误
      if (error.response.status === 403) {
        // 跳转到权限不足页面
        window.location.href = '/forbidden';
        return Promise.reject(error);
      }
      
      // 其他错误处理
      console.error('请求错误:', error.response.data);
    } else {
      console.error('网络错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default request;