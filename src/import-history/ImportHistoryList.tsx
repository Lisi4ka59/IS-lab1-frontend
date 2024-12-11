import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ImportCard from './ImportCard';
import api from '../api';

interface ImportHistory {
    id: number;
    status: 'SUCCESS' | 'FAILED_DUE_TO_ERROR_IN_DATABASE' | 'FAILED_DUE_TO_INCORRECT_DATA_IN_FILE' | 'FAILED_DUE_TO_VALIDATION' | 'FAILED_DUE_TO_INTERNAL_ERROR';
    createdFlats: number;
    createdHouses: number;
    createdCoordinates: number;
    username: string;
    ownerId: number;
    creationDate: string;
}
interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber: string;
    aboutUser: string;
    role: Role[];
}


interface Role {
    id: number;
    name: string;
}

const ImportHistoryList: React.FC = () => {
    const [importHistoryList, setImportHistoryList] = useState<ImportHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/users/profile`);
                const user: User = response.data.user;
                setIsAdmin(user.role?.some((role: any) => role.name === "ADMIN"));
            } catch (error) {
                setError('Ошибка при загрузке данных пользователя!');
            }
        };

        const fetchImportHistory = async () => {
            try {
                setLoading(true);
                const endpoint = isAdmin ? '/flats/import-history-all' : '/flats/import-history';
                const response = await api.get(endpoint);
                setImportHistoryList(response.data.import_history_list);
            } catch (error) {
                setError('Ошибка при загрузке истории импорта!');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData().then(fetchImportHistory);
    }, [isAdmin]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography variant="h6" color="error" align="center">
                {error}
            </Typography>
        );
    }

    return (

        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="h4" color="textSecondary">
                История импортов
            </Typography>
            {importHistoryList.length > 0 ? (
                importHistoryList.map((history) => <ImportCard key={history.id} {...history} />)
            ) : (
                <Typography variant="h6" align="center">
                    История импорта отсутствует.
                </Typography>
            )}
        </Box>
    );
};

export default ImportHistoryList;
