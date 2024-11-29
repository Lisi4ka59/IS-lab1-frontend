import React, {useEffect, useState} from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Stack,
    Box,
    Paper,
} from "@mui/material";
import api from "../api";
import { Inbox as InboxIcon } from "@mui/icons-material";


enum RequestStatus {
    SEND = "SEND",
    APPROVED = "APPROVED",
    DENIED = "DENIED",
}

interface AdminRequest {
    id: number;
    userId: number;
    username: string;
    description: string;
    deniedDescription?: string;
    status?: RequestStatus;
}

const AdminRequests: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [requests, setRequests] = useState<AdminRequest[]>([]);
    const [currentRequest, setCurrentRequest] = useState<AdminRequest | null>(null);
    const [newRequestDescription, setNewRequestDescription] = useState("");
    const [deniedReason, setDeniedReason] = useState("");
    const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
    const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Проверяем, есть ли у пользователя роль ADMIN
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setIsAdmin(user.role?.some((role: any) => role.name === "ADMIN"));

        if (user.role?.some((role: any) => role.name === "ADMIN")) {
            // Если пользователь администратор, загружаем список заявок
            fetchRequests();
        } else {
            // Если пользователь не администратор, проверяем наличие его заявки
            fetchCurrentRequest();
        }
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get("/users/admin-requests");
            setRequests(response.data.adminRequests);
        } catch (error) {
            console.error("Ошибка загрузки заявок", error);
        }
    };

    const fetchCurrentRequest = async () => {
        try {
            const response = await api.get("/users/admin-request");
            setCurrentRequest(response.data.adminRequest);
        } catch (error: any) {
            if (error.response?.status === 404) {
                setCurrentRequest(null);
            } else {
                setErrorMessage("Не удалось загрузить вашу заявку");
            }
        }
    };

    // Отправка новой заявки
    const handleSubmitRequest = async () => {
        if (!newRequestDescription.trim()) {
            setErrorMessage("Описание не может быть пустым");
            return;
        }
        try {
            await api.post("/users/admin-requests", newRequestDescription);
            setNewRequestDescription("");
            setErrorMessage("");
            fetchCurrentRequest();
        } catch (error) {
            setErrorMessage("Не удалось отправить заявку, попробуйте снова");
        }
    };

    const handleAcceptRequest = async (requestId: number) => {
        try {
            await api.put(`/users/admin-requests/${requestId}/accept`);
            fetchRequests();
        } catch (error) {
            console.error("Ошибка при принятии заявки", error);
        }
    };

    const handleDenyRequest = async () => {
        if (!deniedReason.trim()) {
            setErrorMessage("Причина отказа не может быть пустой");
            return;
        }
        try {
            await api.put(`/users/admin-requests/${selectedRequest?.id}/deny`, deniedReason);
            fetchRequests();
            setDeniedReason("");
            setSelectedRequest(null);
            setIsDenyDialogOpen(false);
        } catch (error) {
            setErrorMessage("Не удалось отклонить заявку, попробуйте снова");
        }
    };

    return (
        <Box>
            {!isAdmin ? (
                currentRequest ? (
                    <Paper elevation={2} sx={{p: 2}}>
                        <Typography variant="h6" gutterBottom>
                            Ваша заявка
                        </Typography>
                        <Typography>
                            <strong>ID заявки:</strong> {currentRequest.id}
                        </Typography>
                        <Typography>
                            <strong>Статус:</strong> {currentRequest.status}
                        </Typography>
                        <Typography>
                            <strong>Описание:</strong> {currentRequest.description}
                        </Typography>
                        {currentRequest.status === RequestStatus.DENIED && (
                            <Typography color="error">
                                <strong>Причина отказа:</strong> {currentRequest.deniedDescription}
                            </Typography>
                        )}
                    </Paper>
                ) : (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Подать заявку на администратора
                        </Typography>
                        <TextField
                            label="Расскажите свою мотивацию стать администратором"
                            multiline
                            rows={4}
                            value={newRequestDescription}
                            onChange={(e) => setNewRequestDescription(e.target.value)}
                            fullWidth
                        />
                        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitRequest}
                            sx={{mt: 2}}
                        >
                            Отправить заявку
                        </Button>
                    </Box>
                )


            ) : (
                <Box alignItems={"center"}>
                    <Typography variant="h6" gutterBottom align={"center"}>
                        Заявки на администратора:
                    </Typography>


                    {requests.length !== 0 ? (
                        <>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Пользователь</TableCell>
                                        <TableCell>Описание</TableCell>
                                        <TableCell>Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((request) => (

                                        <TableRow key={request.id}>
                                            <TableCell>{request.id}</TableCell>
                                            <TableCell>{request.username}</TableCell>
                                            <TableCell>{request.description}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        color="success"
                                                        variant="contained"
                                                        onClick={() => handleAcceptRequest(request.id)}
                                                    >
                                                        Принять
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        variant="contained"
                                                        onClick={() => {
                                                            setSelectedRequest(request);
                                                            setIsDenyDialogOpen(true);
                                                        }}
                                                    >
                                                        Отклонить
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>


                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    ) : (
                        <Box display="flex" flexDirection="column" alignItems="center" sx={{mt: 4}}>
                            <InboxIcon sx={{fontSize: 64, color: "gray"}}/>
                            <Typography variant="h6" gutterBottom>
                                Заявок пока что нет...
                            </Typography>
                        </Box>
                    )
                    }


                </Box>
            )}

            {/* Диалог отклонения заявки */}
            <Dialog
                open={isDenyDialogOpen}
                onClose={() => setIsDenyDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Отклонение заявки</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Причина отказа"
                        multiline
                        rows={4}
                        value={deniedReason}
                        onChange={(e) => setDeniedReason(e.target.value)}
                        fullWidth
                    />
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDenyDialogOpen(false)} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleDenyRequest} color="error">
                        Отклонить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminRequests;