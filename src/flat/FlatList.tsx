import React, {useEffect, useState} from "react";
import {
    Box,
    Grid,
    Pagination,
    CircularProgress,
    Alert,
} from "@mui/material";
import api from "../api";
import FlatCard from "./FlatCard";
import {useNavigate} from "react-router-dom";

// Тип для описания квартиры
interface Flat {
    id: number;
    name: string;
    coordinates: { x: number; y: number; ownerId: number };
    creationDate: string;
    area: number;
    price: number;
    balcony: boolean;
    timeToMetroOnFoot: number;
    numberOfRooms: number;
    isNew: boolean;
    furnish: string;
    view: string;
    house: {
        name: string;
        year: number;
        numberOfFlatsOnFloor: number;
        ownerId: number;
    };
    ownerId: number;
}

const PaginatedFlatList: React.FC = () => {
    const [flats, setFlats] = useState<Flat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    // Загрузка списка квартир с сервера
    useEffect(() => {
        const fetchFlats = async () => {
            try {
                setLoading(true);
                const response = await api.get("/flats/flat-list");
                const data = response.data;
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser)); // Преобразуем строку JSON в объект
                } else {
                    // Если нет данных о пользователе, редиректим на страницу логина
                    navigate('/auth');
                }

                setFlats(data.flats || []);
                setError(null);
            } catch (err: any) {
                setError("Не удалось загрузить список квартир.");
            } finally {
                setLoading(false);
            }
        };

        fetchFlats();
    }, [navigate]);

    // Рассчитываем отображаемые квартиры
    const displayedFlats = flats.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    if (loading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", marginTop: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", marginTop: 4}}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{padding: 2}}>
            <Grid container spacing={2}>
                {displayedFlats.map((flat) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={flat.id}>
                        <FlatCard flat={flat} canEdite={flat.ownerId === user.id || user.role?.some((role: any) => role.name === "ADMIN")} canEditeHouse={flat.house?.ownerId === user.id || user.role?.some((role: any) => role.name === "ADMIN")} canEditeCoordinates={flat.coordinates?.ownerId === user.id || user.role?.some((role: any) => role.name === "ADMIN")}/>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{display: "flex", justifyContent: "center", marginTop: 2}}>
                <Pagination
                    count={Math.ceil(flats.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                />
            </Box>
        </Box>
    );
};

export default PaginatedFlatList;
