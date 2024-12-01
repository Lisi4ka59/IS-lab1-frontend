import React, { useState } from 'react';
import api from '../api.ts';
import InputMask from 'react-input-mask';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {HttpStatusCode} from "axios";

const RegistrationForm: React.FC = () => {
    useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        phoneNumber: '',
        aboutUser: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'confirmPassword' || name === 'password') {
            setPasswordError(
                name === 'confirmPassword' && value !== formData.password
                    ? 'Пароли не совпадают'
                    : ''
            );
        }
        if (name === 'password') {
            if (formData.password.length < 8) {
                setPasswordError('Пароль должен быть не менее 8 символов');
                return;
            }
        }


    };

    const handlePasswordVisibilityToggle = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleConfirmPasswordVisibilityToggle = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.username.includes('@')) {
            setErrorMessage('Имя пользователя не должно содержать символ "@".');
            return;
        }
        if (formData.password.length < 8) {
            setPasswordError('Пароль должен быть не менее 8 символов');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Пароли не совпадают');
            return;
        }



        setLoading(true);
        setErrorMessage('');
        try {
            await api.post('/register', formData);
            setSuccessMessage(
                `Регистрация успешна! Мы отправили письмо для активации на адрес ${formData.email}.`
            );
        } catch (error: any) {
            if (error.response?.status === HttpStatusCode.Conflict) {
                setErrorMessage(error.response?.data?.error);
            } else {
                setErrorMessage(
                    error.response?.data?.message || 'Произошла ошибка при регистрации.'
                );
            }

        } finally {
            setLoading(false);
        }
    };

    const handleRedirectToEmail = () => {
        const emailDomain = formData.email.split('@')[1];
        window.open(`https://${emailDomain}`, '_blank');
    };

    return (
        <Box
            sx={{
                maxWidth: 500,
                mx: 'auto',
                mt: 4,
                p: 3,
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Регистрация
            </Typography>
            <form onSubmit={handleSubmit} >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Имя пользователя"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                            required
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            type="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Пароль"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            required
                            type={passwordVisible ? 'text' : 'password'}
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handlePasswordVisibilityToggle}
                                            edge="end"
                                        >
                                            {passwordVisible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Подтверждение пароля"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            fullWidth
                            required
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            error={!!passwordError}
                            helperText={passwordError}
                            autoComplete="new-password"
                            onPaste={(e) => e.preventDefault()}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleConfirmPasswordVisibilityToggle}
                                            edge="end"
                                        >
                                            {confirmPasswordVisible ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Имя"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Фамилия"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputMask
                            mask="+7(999)999-99-99"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            name="phoneNumber"
                            maskChar="_"
                        >
                            {(inputProps: any) => (
                                <TextField
                                    {...inputProps}
                                    label="Номер телефона"
                                    fullWidth
                                    error={!!errorMessage}
                                />
                            )}
                        </InputMask>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="О себе"
                            name="aboutUser"
                            value={formData.aboutUser}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Grid>
                    {successMessage && (
                        <Grid item xs={12}>
                            <Alert severity="success">{successMessage}</Alert>
                            <Button
                                onClick={handleRedirectToEmail}
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                fullWidth
                            >
                                Перейти в почту
                            </Button>
                        </Grid>
                    )}
                    {errorMessage && (
                        <Grid item xs={12}>
                            <Alert severity="error">{errorMessage}</Alert>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default RegistrationForm;
