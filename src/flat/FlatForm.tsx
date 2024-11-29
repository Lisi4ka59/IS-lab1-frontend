import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert,
    FormControlLabel,
    Typography, Switch
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api"; // Замените на свой API
import HouseForm from "./HouseForm"; // Импорт компонента для создания дома
import CoordinatesForm from "./CoordinatesForm"; // Импорт компонента для создания координат
import { useNavigate } from 'react-router-dom';


// Типы для перечислений
enum Furnish {
    DESIGNER = "DESIGNER",
    NONE = "NONE",
    FINE = "FINE",
    BAD = "BAD",
    LITTLE = "LITTLE"
}

enum View {
    PARK = "PARK",
    YARD = "YARD",
    STREET = "STREET"
}

const FlatForm: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [houses, setHouses] = useState<any[]>([]); // Список домов
    const [coordinates, setCoordinates] = useState<any[]>([]); // Список координат
    const [openHouseModal, setOpenHouseModal] = useState(false); // Для отображения формы создания дома
    const [openCoordinatesModal, setOpenCoordinatesModal] = useState(false); // Для отображения формы создания координат
    const [selectedHouse, setSelectedHouse] = useState<any>(null);
    const [selectedCoordinates, setSelectedCoordinates] = useState<any>(null);

    useEffect(() => {
        // Загрузка существующих домов и координат
        const fetchData = async () => {
            try {
                const houseResponse = await api.get("/flats/houses");
                setHouses(houseResponse.data.houses);
                const coordinatesResponse = await api.get("/flats/coordinates");
                setCoordinates(coordinatesResponse.data.coordinates);
            } catch (error) {
                console.error("Ошибка при загрузке данных", error);
            }
        };
        fetchData();
    }, []);

    const validationSchema = Yup.object({
        name: Yup.string().required("Название квартиры обязательно"),
        area: Yup.number().positive("Площадь должна быть положительным числом").required("Площадь обязательна"),
        price: Yup.number().positive("Цена должна быть положительным числом").required("Цена обязательна"),
        house: Yup.object().required("Дом обязателен"),
        coordinates: Yup.object().required("Координаты обязательны"),
        balcony: Yup.boolean(),
        timeToMetroOnFoot: Yup.number().positive("Время до метро должно быть положительным числом"),
        numberOfRooms: Yup.number().positive("Количество комнат должно быть положительным числом"),
        isNew: Yup.boolean().required("Поле 'новая квартира' обязательно"),
        furnish: Yup.mixed().oneOf(Object.values(Furnish)).required("Укажите степень меблировки"),
        view: Yup.mixed().oneOf(Object.values(View)).required("Укажите вид из окна"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            area: "",
            price: "",
            house: null, // Убедитесь, что изначально это null
            coordinates: null, // Убедитесь, что изначально это null
            balcony: false,
            timeToMetroOnFoot: "",
            numberOfRooms: "",
            isNew: false,
            furnish: Furnish.NONE,
            view: View.STREET,
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            // Подготовка данных для отправки
            const flatData = {
                ...values,
                area: parseFloat(values.area), // Преобразование в число
                price: parseFloat(values.price), // Преобразование в число
                timeToMetroOnFoot: parseFloat(values.timeToMetroOnFoot || "0"), // Преобразование в число
                numberOfRooms: parseInt(values.numberOfRooms || "0", 10), // Преобразование в число
                house: selectedHouse, // Используем выбранный дом
                coordinates: selectedCoordinates, // Используем выбранные координаты
            };

            try {
                await api.post("/flats", flatData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setSuccessMessage("Квартира успешно создана.");
                setErrorMessage("");
                formik.resetForm();
                navigate("/");
            } catch (error) {
                setSuccessMessage("");
                setErrorMessage("Произошла ошибка при создании квартиры.");
            } finally {
                setLoading(false);
            }
        },
    });



    const handleOpenHouseModal = () => {
        setOpenHouseModal(true);
    };

    const handleOpenCoordinatesModal = () => {
        setOpenCoordinatesModal(true);
    };

    const handleCloseHouseModal = async (newHouse: any) => {
        setOpenHouseModal(false);
        if (newHouse) {
            const houseResponse = await api.get("/flats/houses");
            setHouses(houseResponse.data.houses);
        }
    };

    const handleCloseCoordinatesModal = async (newCoordinates: any) => {
        setOpenCoordinatesModal(false);
        if (newCoordinates) {
            const coordinatesResponse = await api.get("/flats/coordinates");
            setCoordinates(coordinatesResponse.data.coordinates);
        }
    };

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
            <Typography variant="h4" align="center" gutterBottom>
                Создать квартиру
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
                label="Название квартиры"
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
                label="Площадь"
                type="number"
                {...formik.getFieldProps("area")}
                error={formik.touched.area && Boolean(formik.errors.area)}
                helperText={formik.touched.area && formik.errors.area}
            />

            <TextField
                label="Цена"
                type="number"
                {...formik.getFieldProps("price")}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
            />

            <FormControl fullWidth>
                <InputLabel>Дом</InputLabel>
                <Select
                    value={selectedHouse?.id || ""}
                    onChange={(e) => {
                        const selected = houses.find((house) => house.id === e.target.value);
                        setSelectedHouse(selected);
                        formik.setFieldValue("house", selected);
                    }}
                    label="Дом"
                >
                    {houses.map((house) => (
                        <MenuItem key={house.id} value={house.id}>
                            {house.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleOpenHouseModal}>
                Создать дом
            </Button>

            <FormControl fullWidth>
                <InputLabel>Координаты</InputLabel>
                <Select
                    value={selectedCoordinates?.id || ""}
                    onChange={(e) => {
                        const selected = coordinates.find((coord) => coord.id === e.target.value);
                        setSelectedCoordinates(selected);
                        formik.setFieldValue("coordinates", selected);
                    }}
                    label="Координаты"
                >
                    {coordinates.map((coord) => (
                        <MenuItem key={coord.id} value={coord.id}>
                            {`X: ${coord.x}, Y: ${coord.y}`}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleOpenCoordinatesModal}>
                Создать координаты
            </Button>

            <FormControlLabel
                control={
                    <Switch
                        {...formik.getFieldProps("balcony")}
                        name="isBalcony"
                    />
                }
                label="Балкон"
            />

            <TextField
                label="Время до метро"
                type="number"
                {...formik.getFieldProps("timeToMetroOnFoot")}
                error={formik.touched.timeToMetroOnFoot && Boolean(formik.errors.timeToMetroOnFoot)}
                helperText={formik.touched.timeToMetroOnFoot && formik.errors.timeToMetroOnFoot}
            />

            <TextField
                label="Количество комнат"
                type="number"
                {...formik.getFieldProps("numberOfRooms")}
                error={formik.touched.numberOfRooms && Boolean(formik.errors.numberOfRooms)}
                helperText={formik.touched.numberOfRooms && formik.errors.numberOfRooms}
            />

            <FormControlLabel
                control={
                    <Switch
                        {...formik.getFieldProps("isNew")}
                        name="isNew"
                    />
                }
                label="Новостройка"
            />


            <FormControl fullWidth>
                <InputLabel>Степень меблировки</InputLabel>
                <Select
                    value={formik.values.furnish}
                    onChange={(e) => formik.setFieldValue("furnish", e.target.value)}
                    label="Стиль мебели"
                >
                    {Object.values(Furnish).map((furnishOption) => (
                        <MenuItem key={furnishOption} value={furnishOption}>
                            {furnishOption}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Вид из окна</InputLabel>
                <Select
                    value={formik.values.view}
                    onChange={(e) => formik.setFieldValue("view", e.target.value)}
                    label="Вид из окна"
                >
                    {Object.values(View).map((viewOption) => (
                        <MenuItem key={viewOption} value={viewOption}>
                            {viewOption}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Создать квартиру"}
            </Button>

            {/* Модальные окна для создания дома и координат */}
            <Dialog open={openHouseModal} onClose={() => setOpenHouseModal(false)}>
                <DialogTitle>Создать дом</DialogTitle>
                <DialogContent>
                    <HouseForm onClose={handleCloseHouseModal} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenHouseModal(false)} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openCoordinatesModal} onClose={() => setOpenCoordinatesModal(false)}>
                <DialogTitle>Создать координаты</DialogTitle>
                <DialogContent>
                    <CoordinatesForm onClose={handleCloseCoordinatesModal} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCoordinatesModal(false)} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FlatForm;
