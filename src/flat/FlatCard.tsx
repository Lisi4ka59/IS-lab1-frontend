import React, {useEffect, useState} from "react";
import {
    Card,
    CardContent,
    Typography,
    Divider,
    IconButton,
    TextField,
    Box,
    Dialog,
    DialogActions,
    DialogTitle,
    Button,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {Edit, Delete, Save, Cancel} from "@mui/icons-material";
import api from "../api";



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


const FlatCard: React.FC<{ flat: Flat; onDelete: (id: number) => void }> = ({
                                                                                flat,
                                                                                onDelete,
                                                                            }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedFlat, setEditedFlat] = useState(flat);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Обработчик изменения полей
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = event.target;
        setEditedFlat((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        setEditedFlat((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSelectChange = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        const {name, value} = event.target;
        setEditedFlat((prev) => ({
            ...prev,
            [name || ""]: value,
        }));
    };

    // Сохранение изменений
    const handleSave = async () => {
        try {
            await api.put(`/flats/${flat.id}`, editedFlat);
            setIsEditing(false);
        } catch (error) {
            console.error("Ошибка при сохранении изменений:", error);
        }
    };

    // Удаление квартиры
    const handleDelete = async () => {
        try {
            await api.delete(`/flats/${flat.id}`);
            onDelete(flat.id);
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };


    return (
        <Card sx={{ maxWidth: 600, margin: "auto", position: "relative" }}>
            {/* Кнопки редактирования и удаления */}
            <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex" }}>
                {!isEditing && (
                    <>
                        <IconButton
                            aria-label="edit"
                            onClick={() => setIsEditing(true)}
                            size="small"
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            aria-label="delete"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            size="small"
                        >
                            <Delete />
                        </IconButton>
                    </>
                )}
            </Box>

            <CardContent>
                {isEditing ? (
                    <>
                        <Typography variant="h5" align="center" gutterBottom>
                            Редактирование квартиры
                        </Typography>
                        {/* Поля для редактирования */}
                        <TextField
                            label="Название"
                            name="name"
                            value={editedFlat.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Площадь (м²)"
                            name="area"
                            value={editedFlat.area}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            type="number"
                        />
                        <TextField
                            label="Цена (₽)"
                            name="price"
                            value={editedFlat.price}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            type="number"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editedFlat.balcony}
                                    onChange={handleSwitchChange}
                                    name="balcony"
                                />
                            }
                            label="Балкон"
                        />
                        <TextField
                            label="Время до метро (мин)"
                            name="timeToMetroOnFoot"
                            value={editedFlat.timeToMetroOnFoot}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            type="number"
                        />
                        <TextField
                            label="Количество комнат"
                            name="numberOfRooms"
                            value={editedFlat.numberOfRooms}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            type="number"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editedFlat.isNew}
                                    onChange={handleSwitchChange}
                                    name="isNew"
                                />
                            }
                            label="Новостройка"
                        />
                        <Select
                            name="furnish"
                            value={editedFlat.furnish}
                            onChange={handleSelectChange}
                            fullWidth
                            displayEmpty
                        >
                            <MenuItem value="DESIGNER">Дизайнерская</MenuItem>
                            <MenuItem value="NONE">Без отделки</MenuItem>
                            <MenuItem value="FINE">Хорошая</MenuItem>
                            <MenuItem value="BAD">Плохая</MenuItem>
                            <MenuItem value="LITTLE">Небольшая</MenuItem>
                        </Select>
                        <TextField
                            label="Вид"
                            name="view"
                            value={editedFlat.view}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="h6">Координаты</Typography>
                        <TextField
                            label="X"
                            name="coordinates.x"
                            value={editedFlat.coordinates.x}
                            onChange={(e) =>
                                setEditedFlat((prev) => ({
                                    ...prev,
                                    coordinates: {
                                        ...prev.coordinates,
                                        x: parseFloat(e.target.value),
                                    },
                                }))
                            }
                            margin="normal"
                            type="number"
                            fullWidth
                        />
                        <TextField
                            label="Y"
                            name="coordinates.y"
                            value={editedFlat.coordinates.y}
                            onChange={(e) =>
                                setEditedFlat((prev) => ({
                                    ...prev,
                                    coordinates: {
                                        ...prev.coordinates,
                                        y: parseFloat(e.target.value),
                                    },
                                }))
                            }
                            margin="normal"
                            type="number"
                            fullWidth
                        />
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="h6">Информация о доме</Typography>
                        <TextField
                            label="Название дома"
                            name="house.name"
                            value={editedFlat.house.name}
                            onChange={(e) =>
                                setEditedFlat((prev) => ({
                                    ...prev,
                                    house: { ...prev.house, name: e.target.value },
                                }))
                            }
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            label="Год постройки"
                            name="house.year"
                            value={editedFlat.house.year}
                            onChange={(e) =>
                                setEditedFlat((prev) => ({
                                    ...prev,
                                    house: { ...prev.house, year: parseInt(e.target.value, 10) },
                                }))
                            }
                            margin="normal"
                            type="number"
                            fullWidth
                        />
                        <TextField
                            label="Квартир на этаже"
                            name="house.numberOfFlatsOnFloor"
                            value={editedFlat.house.numberOfFlatsOnFloor}
                            onChange={(e) =>
                                setEditedFlat((prev) => ({
                                    ...prev,
                                    house: {
                                        ...prev.house,
                                        numberOfFlatsOnFloor: parseInt(e.target.value, 10),
                                    },
                                }))
                            }
                            margin="normal"
                            type="number"
                            fullWidth
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                                startIcon={<Save />}
                                onClick={handleSave}
                                variant="contained"
                                color="primary"
                            >
                                Сохранить
                            </Button>
                            <Button
                                startIcon={<Cancel />}
                                onClick={() => {
                                    setEditedFlat(flat);
                                    setIsEditing(false);
                                }}
                                variant="outlined"
                                color="secondary"
                            >
                                Отменить
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            {flat.name}
                        </Typography>

                        <Divider sx={{marginBottom: 2}}/>

                        {/* Общая информация */}
                        <Typography variant="body1">
                            <strong>Площадь:</strong> {flat.area} м²
                        </Typography>
                        <Typography variant="body1">
                            <strong>Цена:</strong> {flat.price.toLocaleString()} ₽
                        </Typography>
                        <Typography variant="body1">
                            <strong>Балкон:</strong> {flat.balcony ? "Есть" : "Нет"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Время до метро пешком:</strong> {flat.timeToMetroOnFoot} мин
                        </Typography>
                        <Typography variant="body1">
                            <strong>Количество комнат:</strong> {flat.numberOfRooms}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Новостройка:</strong> {flat.isNew ? "Да" : "Нет"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Отделка:</strong> {flat.furnish}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Вид:</strong> {flat.view}
                        </Typography>

                        <Divider sx={{marginY: 2}}/>

                        {/* Информация о координатах */}
                        <Typography variant="body1">
                            <strong>Координаты:</strong> x: {flat.coordinates.x}, y: {flat.coordinates.y}
                        </Typography>

                        <Divider sx={{marginY: 2}}/>

                        {/* Информация о доме */}
                        <Typography variant="h6" gutterBottom>
                            Дом
                        </Typography>
                        <Typography variant="body1">
                            <strong>Название:</strong> {flat.house.name}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Год постройки:</strong> {flat.house.year}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Квартир на этаже:</strong> {flat.house.numberOfFlatsOnFloor}
                        </Typography>

                        <Divider sx={{marginY: 2}}/>

                        {/* Прочая информация */}
                        <Typography variant="body1">
                            <strong>Дата создания:</strong>{" "}
                            {new Date(flat.creationDate).toLocaleString("ru-RU")}
                        </Typography>
                        <Typography variant="body1">
                            <strong>ID владельца:</strong> {flat.ownerId}
                        </Typography>
                    </>
                )}
            </CardContent>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleDelete} color="error">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default FlatCard;
