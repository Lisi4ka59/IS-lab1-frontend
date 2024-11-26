import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Получаем информацию о пользователе из localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser)); // Преобразуем строку JSON в объект
        } else {
            // Если нет данных о пользователе, редиректим на страницу логина
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth'); // Перенаправление на страницу логина после выхода
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Добро пожаловать на домашнюю страницу
            </Typography>

            {user ? (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Информация о пользователе:</Typography>
                            <Typography><strong>Имя:</strong> {user.name}</Typography>
                            <Typography><strong>Фамилия:</strong> {user.surname}</Typography>
                            <Typography><strong>Email:</strong> {user.email}</Typography>
                            <Typography><strong>Телефон:</strong> {user.phoneNumber}</Typography>
                            <Typography><strong>О себе:</strong> {user.aboutUser}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>
                            Выйти
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                <Typography variant="body1" align="center">Загрузка данных...</Typography>
            )}
        </Box>
    );
};

export default HomePage;
