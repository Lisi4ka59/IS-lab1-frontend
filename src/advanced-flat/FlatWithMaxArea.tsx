import React, { useEffect, useState } from 'react';
import api from '../api';
import {Box, CircularProgress, Alert, Typography} from '@mui/material';
import FlatCard from '../flat/FlatCard'; // Импортируем компонент карточки (путь зависит от вашей структуры проекта)

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

const FlatWithMaxArea: React.FC = () => {
    const [flat, setFlat] = useState<Flat | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlatWithMaxArea = async () => {
            try {
                setLoading(true);
                const response = await api.get('/ad-flat/max-area');
                setFlat(response.data.flat);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка при загрузке данных.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlatWithMaxArea();
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
        <Box display="flex" flexDirection="column" alignItems="center" height="100%">
            {flat ? (
                <>
                    <Typography variant="h5" mt={6}>
                        Квартира с максимальной площадью
                    </Typography>
                <FlatCard flat={flat} canEdite={false} canEditeHouse={false} canEditeCoordinates={false} />
                </>
            ) : (
                <Alert severity="info">Нет данных о квартире с максимальной площадью.</Alert>
            )}
        </Box>
    );
};

export default FlatWithMaxArea;
