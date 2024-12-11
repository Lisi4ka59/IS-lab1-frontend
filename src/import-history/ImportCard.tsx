import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface ImportHistoryProps {
    id: number;
    status: 'SUCCESS' | 'FAILED_DUE_TO_ERROR_IN_DATABASE' | 'FAILED_DUE_TO_INCORRECT_DATA_IN_FILE' | 'FAILED_DUE_TO_VALIDATION' | 'FAILED_DUE_TO_INTERNAL_ERROR';
    createdFlats: number;
    createdHouses: number;
    createdCoordinates: number;
    username: string;
    ownerId: number;
    creationDate: string;
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
                                                         }) => {
    const isSuccess = status === 'SUCCESS';

    return (
        <Box alignItems={"center"} maxWidth={500} minWidth={300}>
        <Card sx={{ margin: 2, width: "100%" }}>
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
            </CardContent>
        </Card>
        </Box>
    );
};

export default ImportCard;
