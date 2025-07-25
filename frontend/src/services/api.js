import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ message: 'No se recibió respuesta del servidor' });
    } else {
      return Promise.reject({ message: 'Error al configurar la solicitud' });
    }
  }
);

export default api;