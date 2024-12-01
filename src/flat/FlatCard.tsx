import React, {useState} from "react";
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
    MenuItem, SelectChangeEvent
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


const FlatCard: React.FC<{ flat: Flat; canEdite: boolean, canEditeHouse: boolean, canEditeCoordinates:boolean }> = ({flat, canEdite, canEditeHouse, canEditeCoordinates}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedFlat, setEditedFlat] = useState(flat);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentFlat, setCurrentFlat] = useState(flat);
    const [isDeleted, setIsDeleted] = useState(false);
    const [errorDataMessage, setErrorDataMessage] = useState('');
    const [errorDeletingMessage, setErrorDeletingMessage] = useState('');
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        let error = '';

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    error = 'Поле не может быть пустым';
                }
                break;

            case 'area':
                if (parseFloat(value) <= 0) {
                    error = 'Площадь должна быть больше 0';
                }
                break;

            case 'price':
                if (parseFloat(value) <= 0 || parseFloat(value) > 777301647) {
                    error = 'Цена должна быть больше 0 и меньше 777301647';
                }
                break;

            case 'timeToMetroOnFoot':
                if (parseInt(value, 10) <= 0) {
                    error = 'Время до метро должно быть больше 0';
                }
                break;

            case 'numberOfRooms':
                if (parseInt(value, 10) <= 0) {
                    error = 'Количество комнат должно быть больше 0';
                }
                break;

            case 'coordinates.x':
                if (parseFloat(value) > 665 || value.trim() === '') {
                    error = 'Координата X должна быть меньше или равна 665 и не может быть пустой';
                }
                break;

            case 'coordinates.y':
                if (parseFloat(value) <= -28) {
                    error = 'Координата Y должна быть больше -28';
                }
                break;

            case 'house.year':
                if (parseInt(value, 10) <= 0) {
                    error = 'Год должен быть больше 0';
                }
                break;

            case 'house.numberOfFlatsOnFloor':
                if (parseInt(value, 10) <= 0) {
                    error = 'Значение поля должно быть больше 0';
                }
                break;

            default:
                break;
        }
        setErrors((prev) => ({ ...prev, [name]: error }));

        setEditedFlat((prev) => ({
                ...prev,
                [name.includes('.') ? name.split('.')[0] : name]: name.includes('.')
                    ? {
                        ...prev[name.toString().split('.')[0]],
                        [name.split('.')[1]]: value,
                    }
                    : value,
            }));
    };


    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        setEditedFlat((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const {name, value} = event.target;
        setEditedFlat((prev) => ({
            ...prev,
            [name || ""]:  value === "" ? null : value,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await api.put(`/flats`, editedFlat);
            setCurrentFlat(response.data.updatedFlat);
            setEditedFlat(response.data.updatedFlat);
            flat = response.data.updatedFlat;
            setIsEditing(false);
            setErrorDataMessage("");
        } catch (error) {
            setErrorDataMessage("Ошибка при сохранении изменений");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/flats/${flat.id}`);
            setIsDeleted(true);
            setIsDeleteDialogOpen(false);
            setErrorDeletingMessage("");
        } catch (error) {
            setErrorDeletingMessage("Ошибка при удалении");
        }
    };


    return (
        <Card sx={{maxWidth: 600, minWidth: 200, margin: "auto", position: "relative", marginTop: "20px"}} >
            {/* Кнопки редактирования и удаления */}
            {canEdite && (
                <Box sx={{position: "absolute", top: 8, right: 8, display: "flex"}}>
                    {!isDeleted && (
                        <>
                            {!isEditing && (
                                <>
                                    <IconButton
                                        aria-label="edit"
                                        onClick={() => setIsEditing(true)}
                                        size="small"
                                    >
                                        <Edit/>
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                        size="small"
                                    >
                                        <Delete/>
                                    </IconButton>
                                </>
                            )}
                        </>
                    )}

                </Box>
            )}

            <CardContent>
                {isDeleted ? (
                    <Box sx={{textAlign: "center", padding: 2}}>
                        <Delete sx={{fontSize: 50, color: "gray"}}/>
                        <Typography variant="h6" sx={{marginTop: 2}}>
                            Квартира <strong>{flat.name}</strong> удалена
                        </Typography>
                    </Box>
                ) : (
                    <>
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
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                                <TextField
                                    label="Площадь (м²)"
                                    name="area"
                                    value={editedFlat.area}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    error={!!errors.area}
                                    helperText={errors.area}
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
                                <Box mt={2}>
                                    <Select
                                        name="furnish"
                                        value={editedFlat.furnish}
                                        onChange={handleSelectChange}
                                        fullWidth
                                        displayEmpty
                                    >
                                        <MenuItem value="">
                                            <em>Не выбрано</em>
                                        </MenuItem>
                                        <MenuItem value="DESIGNER">Дизайнерская</MenuItem>
                                        <MenuItem value="NONE">Без отделки</MenuItem>
                                        <MenuItem value="FINE">Хорошая</MenuItem>
                                        <MenuItem value="BAD">Плохая</MenuItem>
                                        <MenuItem value="LITTLE">Небольшая</MenuItem>

                                    </Select>
                                </Box>

                                <Box mt={3}>
                                    <Select
                                        name="view"
                                        value={editedFlat.view}
                                        onChange={handleSelectChange}
                                        fullWidth
                                        displayEmpty

                                    >
                                        <MenuItem value="STREET">Улица</MenuItem>
                                        <MenuItem value="YARD">Двор</MenuItem>
                                        <MenuItem value="PARK">Парк</MenuItem>
                                    </Select>
                                </Box>

                                <Divider sx={{marginY: 2}}/>
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
                                    disabled={!canEditeCoordinates}
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
                                    disabled={!canEditeCoordinates}
                                />
                                <Divider sx={{marginY: 2}}/>
                                <Typography variant="h6">Информация о доме</Typography>
                                <TextField
                                    label="Название дома"
                                    name="house.name"
                                    value={editedFlat.house.name}
                                    onChange={(e) =>
                                        setEditedFlat((prev) => ({
                                            ...prev,
                                            house: {...prev.house, name: e.target.value},
                                        }))
                                    }
                                    margin="normal"
                                    fullWidth
                                    disabled={!canEditeHouse}
                                />
                                <TextField
                                    label="Год постройки"
                                    name="house.year"
                                    value={editedFlat.house.year}
                                    onChange={(e) =>
                                        setEditedFlat((prev) => ({
                                            ...prev,
                                            house: {...prev.house, year: parseInt(e.target.value, 10)},
                                        }))
                                    }
                                    margin="normal"
                                    type="number"
                                    fullWidth
                                    disabled={!canEditeHouse}

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
                                    disabled={!canEditeHouse}

                                />
                                <Box sx={{display: "flex", justifyContent: "space-between", gap: 1}}>
                                    <Button
                                        startIcon={<Save/>}
                                        onClick={handleSave}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Сохранить
                                    </Button>
                                    <Button
                                        startIcon={<Cancel/>}
                                        onClick={() => {
                                            setEditedFlat(flat);
                                            setIsEditing(false);
                                        }}
                                        variant="outlined"
                                        color="secondary"
                                    >
                                        Отменить
                                    </Button>
                                    {errorDataMessage && <Typography color="error" align={"center"}>{errorDataMessage}</Typography>}

                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography variant="h5" gutterBottom>
                                    {currentFlat.name}
                                </Typography>

                                <Divider sx={{marginBottom: 2}}/>

                                {/* Общая информация */}

                                <Typography variant="body1" color="textSecondary">
                                    <strong>ID:</strong> {currentFlat.id}
                                </Typography>
                                <Typography variant="body1" mt={1}>

                                    <strong>Площадь:</strong> {currentFlat.area} м²
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Цена:</strong> {currentFlat.price.toLocaleString()} ₽
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Балкон:</strong> {currentFlat.balcony ? "Есть" : "Нет"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>До метро пешком:</strong> {currentFlat.timeToMetroOnFoot} мин
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Количество комнат:</strong> {currentFlat.numberOfRooms}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Новостройка:</strong> {currentFlat.isNew ? "Да" : "Нет"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Отделка:</strong> {currentFlat.furnish}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Вид:</strong> {currentFlat.view}
                                </Typography>

                                <Divider sx={{marginY: 2}}/>

                                {/* Информация о координатах */}
                                <Typography variant="body1">
                                    <strong>Координаты:</strong> x: {currentFlat.coordinates.x},
                                    y: {currentFlat.coordinates.y}
                                </Typography>

                                <Divider sx={{marginY: 2}}/>

                                {/* Информация о доме */}
                                <Typography variant="h6" gutterBottom>
                                    Дом
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Название:</strong> {currentFlat.house.name}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Год постройки:</strong> {currentFlat.house.year}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Квартир на этаже:</strong> {currentFlat.house.numberOfFlatsOnFloor}
                                </Typography>

                                <Divider sx={{marginY: 2}}/>

                                <Typography variant="body1">
                                    <strong>Дата создания:</strong>{" "}
                                    {new Date(currentFlat.creationDate).toLocaleString("ru-RU")}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>ID владельца:</strong> {currentFlat.ownerId}
                                </Typography>
                            </>
                        )}
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
                    {errorDeletingMessage && <Typography color="error" align={"center"}>{errorDeletingMessage}</Typography>}
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default FlatCard;
