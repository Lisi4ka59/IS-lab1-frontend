import React, {useState} from "react";
import FlatCard from "./FlatCard.tsx";
import SearchBar from "./SearchBar";
import api from "../api.ts";
import {Box} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface Coordinates {
    x: number;
    y: number;
    ownerId: number;
}

interface House {
    name: string;
    year: number;
    numberOfFlatsOnFloor: number;
    ownerId: number;
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

const FlatSearch: React.FC = () => {
    const navigate = useNavigate();
    const [flats, setFlats] = useState<Flat[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<any>(null);


    // Функция для получения списка квартир
    const fetchFlats = async () => {
        const response = await api.get('/flats/flat-list');
        const data = response.data;
        setFlats(data.flats);
    };

    // Обработчик поиска
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filterFlats = (flats: Flat[], query: string) => {
        const conditions = query.split('/').map(item => item.trim()).filter(Boolean);  // Разделяем по "/"

        return flats.filter(flat => {
            return conditions.every(condition => {
                const [field, value] = condition.split(':');
                if (field && value) {
                    const flatField = getNestedValue(flat, field);
                    return flatField?.toString().toLowerCase().includes(value.toLowerCase()) ?? false;
                }
                return false;
            });
        });
    };

    const getNestedValue = (obj: any, path: string): any => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    };
    // Загружаем данные при монтировании компонента
    React.useEffect(() => {
        fetchFlats();
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser)); // Преобразуем строку JSON в объект
        } else {
            // Если нет данных о пользователе, редиректим на страницу логина
            navigate('/auth');
        }
    }, []);

    // Фильтруем квартиры
    const filteredFlats = filterFlats(flats, searchQuery);

    return (
        <Box width={"100%"} display="flex" flexDirection="column" alignItems="center">

        <Box maxWidth={600} >
            <SearchBar onSearch={handleSearch} />
            <Box width={"100%"}>
                {filteredFlats.map(flat => (
                    <FlatCard key={flat.id} flat={flat} canEdite={flat.ownerId === user.id || user.role?.some((role: any) => role.name === "ADMIN")} canEditeHouse={flat.house?.ownerId === user.id || user.role?.some((role: any) => role.name === "ADMIN")} canEditeCoordinates={flat.coordinates?.ownerId === user.id || user.role?.some((role: any) => role.name === "ADMIN")} />
                ))}
            </Box>
        </Box>
        </Box>
    );
};
export default FlatSearch;
