import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Snackbar, Alert } from '@mui/material';
import { FileDownloadOutlined } from '@mui/icons-material';
import api from '../api';

interface ImportHistoryProps {
    id: number;
    status: 'SUCCESS' | 'FAILED_DUE_TO_ERROR_IN_DATABASE' | 'FAILED_DUE_TO_INCORRECT_DATA_IN_FILE' | 'FAILED_DUE_TO_VALIDATION' | 'FAILED_DUE_TO_INTERNAL_ERROR';
    createdFlats: number;
    createdHouses: number;
    createdCoordinates: number;
    username: string;
    ownerId: number;
    creationDate: string;
    filePath: string;
}

const ImportCard: React.FC<ImportHistoryProps> = ({
                                                      id,
                                                      status,
                                                      createdFlats,
                                                      createdHouses,
                                                      createdCoordinates,
                                                      username,
                                                      ownerId,
                                                      creationDate,
                                                      filePath,
                                                  }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success' | 'info'>('error');

    const isSuccess = status === 'SUCCESS';

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleDownload = async () => {
        try {
            const response = await api.get(`/flats/download`, {
                params: { filePath },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filePath.split('/').pop() || 'file');
            document.body.appendChild(link);
            link.click();
            link.remove();
            setSnackbarMessage('Файл успешно загружен!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 404) {
                    setSnackbarMessage('Файл не найден в хранилище.');
                } else if (error.response.status === 500) {
                    setSnackbarMessage('Ошибка: файловое хранилище недоступно.');
                } else {
                    setSnackbarMessage(`Произошла ошибка: ${error.response.statusText}`);
                }
            } else {
                setSnackbarMessage('Произошла ошибка при загрузке файла.');
            }
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box alignItems="center" maxWidth={500} minWidth={300}>
            <Card sx={{ margin: 2, width: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Импорт ID: {id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Статус: {status}
                    </Typography>
                    {isSuccess && (
                        <Box sx={{ marginTop: 2 }}>
                            <Typography variant="body2">Создано квартир: {createdFlats}</Typography>
                            <Typography variant="body2">Создано домов: {createdHouses}</Typography>
                            <Typography variant="body2">Создано координат: {createdCoordinates}</Typography>
                        </Box>
                    )}
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        Имя пользователя: {username}
                    </Typography>
                    <Typography variant="body2">ID создателя: {ownerId}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Дата импорта: {new Date(creationDate).toLocaleString()}
                    </Typography>

                    {filePath && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: 2,
                                cursor: 'pointer',
                                color: 'primary.main',
                            }}
                            onClick={handleDownload}
                        >
                            <FileDownloadOutlined sx={{ marginRight: 1 }} />
                            <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
                                {filePath.split('/').pop()}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ImportCard;