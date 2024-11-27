import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Укажите здесь базовый URL для вашего API, например 'http://localhost:8080/api' в dev режиме
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем интерцептор для автоматической подстановки токена авторизации
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error: any) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        return response; // Если ответ успешный, возвращаем его как есть
    },
    (error) => {
        if (error.response && error.response.status === 403) {
            // Если статус 403, очищаем токен и редиректим на страницу авторизации
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // Если вы храните пользователя, очищаем данные
            window.location.href = '/auth'; // Редирект на страницу авторизации
        }
        return Promise.reject(error); // Прокидываем ошибку дальше
    }
);

export default api;
