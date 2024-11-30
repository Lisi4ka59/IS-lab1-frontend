import React, { useState, useEffect } from 'react';
import api from '../api';
import { Box, ToggleButton, ToggleButtonGroup, Typography, CircularProgress, Alert } from '@mui/material';

const FlatsCountByIsNew: React.FC = () => {
    const [value, setValue] = useState<boolean>(true); // true для новостроек, false для бывших в употреблении
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlatsCount = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/ad-flat/count-is-new/${value}`);
                setCount(response.data.count);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка при загрузке данных.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlatsCount();
    }, [value]); // Запрос будет повторяться при изменении значения value

    const handleToggle = (_: React.MouseEvent<HTMLElement>, newValue: boolean | null) => {
        if (newValue !== null) {
            setValue(newValue);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4} minWidth={"300px"}>
            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={handleToggle}
                aria-label="Новостройка или бывшая в употреблении"


            >
                <ToggleButton value={true} aria-label="Новостройка" sx={{ width: '100%' }}>
                    Новостройка
                </ToggleButton>
                <ToggleButton value={false} aria-label="Бывшая в употреблении" sx={{ width: '100%' }}>
                    Бывшая в употреблении
                </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="h6" mt={2}>
                Количество квартир: {count !== null ? count : 'Не удалось загрузить данные'}
            </Typography>
        </Box>
    );
};

export default FlatsCountByIsNew;
