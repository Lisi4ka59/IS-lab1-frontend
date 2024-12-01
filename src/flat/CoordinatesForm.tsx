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

interface CoordinatesFormProps {
    onClose: (newCoordinates: any) => void;
}

const CoordinatesForm: React.FC<CoordinatesFormProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const validationSchema = Yup.object({
        x: Yup.string()
            .matches(
                /^-?\d+(\.\d+)?$/,
                "Координата X должна быть числом (может содержать десятичную точку)"
            )
            .test(
                "max",
                "Значение X не может превышать 665",
                (value) => value === undefined || parseFloat(value) <= 665
            )
            .required("Координата X обязательна"),
        y: Yup.string()
            .matches(
                /^-?\d+(\.\d+)?$/,
                "Координата Y должна быть числом (может содержать десятичную точку)"
            )
            .test(
                "min",
                "Значение Y не может быть меньше -28",
                (value) => value === undefined || parseFloat(value) >= -28
            )
            .required("Координата Y обязательна"),
    });

    const formik = useFormik({
        initialValues: {
            x: "",
            y: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const payload = {
                    x: parseFloat(values.x),
                    y: parseFloat(values.y),
                };

                const response = await api.post("/flats/coordinates", payload);
                setSuccessMessage("Координаты успешно созданы.");
                onClose(response.data);
                formik.resetForm();
            } catch (error: any) {
                setErrorMessage(
                    error.response?.data?.message || "Произошла ошибка при создании координат."
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
                Создать координаты
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
                label="X"
                type="text"
                {...formik.getFieldProps("x")}
                error={formik.touched.x && Boolean(formik.errors.x)}
                helperText={formik.touched.x && formik.errors.x}
            />

            <TextField
                label="Y"
                type="text"
                {...formik.getFieldProps("y")}
                error={formik.touched.y && Boolean(formik.errors.y)}
                helperText={formik.touched.y && formik.errors.y}
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

export default CoordinatesForm;