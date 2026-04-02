import axios from "axios";

axios.defaults.baseURL = 'https://mvu07ybpnj.execute-api.us-west-2.amazonaws.com';
// axios.defaults.baseURL = 'http://localhost:3000';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use((response) => {
  return response;
}, function (error) {
  const authError = error.response?.status === 401;
  if (authError) {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});
export default axios;