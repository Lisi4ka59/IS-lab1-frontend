import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Alert,
    styled,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDropzone } from "react-dropzone";
import api from "../api.ts";

// Стили для области drag-and-drop
const DropzoneContainer = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: "center",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

const FlatImport: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<"success" | "error" | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setMessage(null); // Сбрасываем сообщения
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
        multiple: false,
    });

    const handleFileUpload = async () => {
        if (!file) {
            setMessage("Пожалуйста, выберите файл.");
            setErrorType("error");
            return;
        }

        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/flats/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            switch (response.status) {
                case 201: {
                    setFile(null);
                    setMessage(`Успешно создано ${response.data?.flatsImported || 0} квартир.\nУспешно создано ${response.data?.housesImported || 0} домов.\nУспешно создано ${response.data?.coordinatesImported || 0} координат.`);
                    setErrorType("success");
                    break;
                }
                case 409:
                    setMessage(
                        "Квартиры не были созданы из-за ошибки сохранения в БД."
                    );
                    setErrorType("error");
                    break;
                case 400:
                    setMessage(
                        `В описании квартир не прошло валидацию: ${response.data?.error || "Неизвестная ошибка."}`
                    );
                    setErrorType("error");
                    break;
                default:
                    setMessage("Упс, что-то пошло не так.");
                    setErrorType("error");
            }
        } catch (error) {
            setMessage("Ошибка при отправке файла. Проверьте соединение с сервером.");
            setErrorType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: 2,
            }}
        >
            <Typography mt={8} variant="h4">Импорт квартир</Typography>

            <DropzoneContainer maxWidth={500} mt={4} {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <Typography>Отпустите файл здесь...</Typography>
                ) : (
                    <Typography>
                        Перетащите файл сюда или нажмите, чтобы выбрать файл (.xlsx)
                    </Typography>
                )}
            </DropzoneContainer>

            {file && <Typography>Выбран файл: {file.name}</Typography>}

            <Button
                variant="contained"
                color="primary"
                onClick={handleFileUpload}
                disabled={loading}
                startIcon={<UploadFileIcon />}
            >
                {loading ? <CircularProgress size={24} /> : "Загрузить"}
            </Button>

            {message && (
                <Alert severity={errorType || "info"} sx={{ marginTop: 2 }}>
                    {message}
                </Alert>
            )}
        </Box>
    );
};

export default FlatImport;
