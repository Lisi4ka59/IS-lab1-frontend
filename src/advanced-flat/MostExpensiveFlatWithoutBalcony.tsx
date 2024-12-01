import React, {useState, useEffect} from 'react';
import api from '../api';
import {Box, CircularProgress, Alert, Typography} from '@mui/material';
import FlatCard from '../flat/FlatCard';

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

const MostExpensiveFlatWithoutBalcony: React.FC = () => {
    const [flat, setFlat] = useState<Flat | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMostExpensiveFlat = async () => {
            try {
                setLoading(true);
                const response = await api.get('/ad-flat/most-expensive-without-balcony');
                setFlat(response.data.flat);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка при загрузке данных.');
            } finally {
                setLoading(false);
            }
        };

        fetchMostExpensiveFlat();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
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
                        Самая дорогая квартира без балкона
                    </Typography>
                    <FlatCard
                        flat={flat}
                        canEdite={false}
                        canEditeHouse={false}
                        canEditeCoordinates={false}
                    />
                </>
            ) : (
                <Alert severity="info">Нет данных о самой дорогой квартире без балкона.</Alert>
            )}
        </Box>
    );
};

export default MostExpensiveFlatWithoutBalcony;
