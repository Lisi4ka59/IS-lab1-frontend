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
        <Card sx={{ maxWidth: 400, margin: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Import History ID: {id}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Status: {status}
                </Typography>
                {isSuccess && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="body2">Created Flats: {createdFlats}</Typography>
                        <Typography variant="body2">Created Houses: {createdHouses}</Typography>
                        <Typography variant="body2">Created Coordinates: {createdCoordinates}</Typography>
                    </Box>
                )}
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Username: {username}
                </Typography>
                <Typography variant="body2">Owner ID: {ownerId}</Typography>
                <Typography variant="body2" color="textSecondary">
                    Created At: {new Date(creationDate).toLocaleString()}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ImportCard;
