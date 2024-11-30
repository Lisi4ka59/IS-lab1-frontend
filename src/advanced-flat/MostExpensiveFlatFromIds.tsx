import React, { useState } from 'react';
import api from '../api';
import { Box, TextField, Button, CircularProgress, Alert, Typography } from '@mui/material';
import FlatCard from '../flat/FlatCard'; // Импортируем компонент FlatCard

interface Coordinates {
    x: number;
    y: number;
}

interface House {
    name: string;
    year: number;
    numberOfFlatsOnFloor: number;
}

interface Flat {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: string;
    area: number;
    price: number;
    balcony: boolean;
    timeToMetroOnFoot: number;
    numberOfRooms: number;
    isNew: boolean;
    furnish: string;
    view: string;
    house: House;
    ownerId: number;
}

const MostExpensiveFlatFromIds: React.FC = () => {
    const [ids, setIds] = useState<string>('');
    const [flat, setFlat] = useState<Flat | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIds(event.target.value);
    };

    const handleSubmit = async () => {
        const idArray = ids.split(',').map((id) => id.trim()).filter(Boolean); // Разбиваем по запятой и очищаем пробелы

        // Проверяем, что введены ровно три id, и все они неотрицательные числа
        if (idArray.length !== 3) {
            setValidationError('Пожалуйста, введите ровно 3 id.');
            return;
        }

        const invalidId = idArray.find((id) => isNaN(Number(id)) || Number(id) < 0);
        if (invalidId) {
            setValidationError('Все id должны быть неотрицательными числами.');
            return;
        }

        setValidationError(null); // Очищаем ошибку валидации
        setLoading(true);

        try {
            const response = await api.post('/ad-flat/most-expensive', idArray.map(Number));
            setFlat(response.data.flat);
            setError("");
            setValidationError("");
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('Квартир с такими id не существует.');
            } else {
                setError(err.response?.data?.message || 'Ошибка при загрузке данных.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4} >
            <Box display="flex" flexDirection="column" alignItems="center" maxWidth={500}>


            <Typography variant="h6" gutterBottom>
                Выберите три квартиры по их id:
            </Typography>

            <TextField
                label="Введите ID квартир (через запятую)"
                value={ids}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                error={!!validationError}
                sx={{ mb: 2 }}
            />

            {validationError && <Alert severity="error" >{validationError}</Alert>}

            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Найти самую дорогую квартиру'}
            </Button>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            {flat && !error && !validationError && (
                <Box mt={4}>
                    <FlatCard
                        flat={flat}
                        canEdite={false}
                        canEditeHouse={false}
                        canEditeCoordinates={false}
                    />
                </Box>
            )}
            </Box>
        </Box>
    );
};

export default MostExpensiveFlatFromIds;
