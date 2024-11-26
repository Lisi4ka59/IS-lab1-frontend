import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import LoginForm from '../auth/LoginForm';
import RegistrationForm from '../auth/RegistrationForm';

const AuthPage: React.FC = () => {
    const [showLogin, setShowLogin] = useState(true);

    const handleToggle = () => {
        setShowLogin(!showLogin);
    };

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
                //backgroundColor: '#f5f5f5',
                p: 2,
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    //backgroundColor: '#fff',
                }}
            >
                {showLogin ? (
                    <>
                        <LoginForm />
                        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                            Нет аккаунта?{' '}
                            <Button variant="text" onClick={handleToggle}>
                                Зарегистрироваться
                            </Button>
                        </Typography>
                    </>
                ) : (
                    <>
                        <RegistrationForm />
                        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                            Уже есть аккаунт?{' '}
                            <Button variant="text" onClick={handleToggle}>
                                Войти
                            </Button>
                        </Typography>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default AuthPage;
