import React, { useState } from "react";
import api from '../api.ts';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

interface HouseFormProps {
    onClose: (newHouse: any) => void;
}

const HouseForm: React.FC<HouseFormProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const validationSchema = Yup.object({
        name: Yup.string()
            .max(255, "Название не может превышать 255 символов")
            .required("Название обязательно"),
        year: Yup.number()
            .positive("Год должен быть положительным числом")
            .integer("Год должен быть целым числом")
            .required("Год постройки обязателен"),
        numberOfFlatsOnFloor: Yup.number()
            .positive("Количество квартир на этаже должно быть положительным")
            .integer("Количество квартир на этаже должно быть целым числом")
            .required("Количество квартир на этаже обязательно"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            year: "",
            numberOfFlatsOnFloor: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const payload = {
                    name: values.name,
                    year: parseInt(values.year, 10),
                    numberOfFlatsOnFloor: parseInt(values.numberOfFlatsOnFloor, 10),
                };

                const response = await api.post("/flats/house", payload);
                setSuccessMessage("Дом успешно создан.");
                onClose(response.data);

                formik.resetForm();
            } catch (error: any) {
                setErrorMessage(
                    error.response?.data?.message || "Произошла ошибка при создании дома."
                );
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "300px",
                margin: "0 auto",
            }}
        >
            <Typography variant="h5" textAlign="center">
                Создать дом
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
                label="Название"
                type="text"
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
                label="Год постройки"
                type="text"
                {...formik.getFieldProps("year")}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
            />

            <TextField
                label="Количество квартир на этаже"
                type="text"

                {...formik.getFieldProps("numberOfFlatsOnFloor")}
                error={
                    formik.touched.numberOfFlatsOnFloor &&
                    Boolean(formik.errors.numberOfFlatsOnFloor)
                }
                helperText={
                    formik.touched.numberOfFlatsOnFloor &&
                    formik.errors.numberOfFlatsOnFloor
                }
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Создать"}
            </Button>
        </Box>
    );
};

export default HouseForm;
