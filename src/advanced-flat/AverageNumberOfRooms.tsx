import React, { useEffect, useState } from 'react';
import api from '../api';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const AverageNumberOfRooms: React.FC = () => {
    const [averageNumberOfRooms, setAverageNumberOfRooms] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAverageNumberOfRooms = async () => {
            try {
                setLoading(true);
                const response = await api.get('/ad-flat/averageNumberOfRooms');
                setAverageNumberOfRooms(response.data.averageNumberOfRooms);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка при загрузке данных.');
            } finally {
                setLoading(false);
            }
        };

        fetchAverageNumberOfRooms();
    }, []);

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
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h5" gutterBottom>
                Среднее количество комнат
            </Typography>
            <Typography variant="h6">
                {averageNumberOfRooms !== null ? averageNumberOfRooms.toFixed(2) : 'Нет данных'}
            </Typography>
        </Box>
    );
};

export default AverageNumberOfRooms;
