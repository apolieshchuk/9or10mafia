import axios from "axios";
axios.interceptors.response.use((response) => {
  return response;
}, function (error) {
  console.log(`--->`, error, 'axios.tsx:6')
  const authError = error.response?.status === 401;
  if (authError) {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});
export default axios;