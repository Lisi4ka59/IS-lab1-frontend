import React, { useEffect, useState } from 'react';
import {Box, Typography, Button, Alert, CircularProgress} from '@mui/material';
import { useNavigate } from 'react-router-dom';


const HomePage: React.FC = () => {
    const [user, setUser] = useState<any>(null); // Данные пользователя
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(''); // Сообщение об ошибке
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } else {
                    throw new Error('Пользователь не найден. Выполните вход.');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Загрузка информации о пользователе...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, textAlign: 'center' }}>
                <Alert severity="error">{error}</Alert>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                    sx={{ mt: 2 }}
                >
                    Вернуться на страницу входа
                </Button>
            </Box>
        );
    }

    const isActivated = user?.role?.length > 0;

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Добро пожаловать, {user?.name} {user?.surname}
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Имя пользователя:</strong> {user?.username}
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Телефон:</strong> {user?.phoneNumber || 'Не указан'}
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>О пользователе:</strong> {user?.aboutUser || 'Информация отсутствует'}
            </Typography>
            {isActivated ? (
                <Typography variant="body1" gutterBottom>
                    <strong>Роли:</strong> {user?.role.map((r: any) => r.name).join(', ')}
                </Typography>
            ) : (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Ваш аккаунт еще не активирован. Проверьте вашу почту для завершения активации.
                </Alert>
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogout}
                sx={{ mt: 3 }}
            >
                Выйти
            </Button>
        </Box>
    );
};

export default HomePage;