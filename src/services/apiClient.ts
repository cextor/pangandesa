import axios from 'axios';

// Konfigurasi dasar Axios
const apiClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8081/api', // Disesuaikan dengan URL CI4 nantinya
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Interceptor Request: Menyisipkan Token JWT ke setiap request (jika ada)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor Response: Penanganan global untuk error (misal token kedaluwarsa)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika Unauthorized (misal token salah/expired), arahkan ke login
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access. Redirecting to login...');
      // localStorage.removeItem('token');
      // window.location.href = '/login'; // Jika menggunakan react-router
    }
    return Promise.reject(error);
  }
);

export default apiClient;
