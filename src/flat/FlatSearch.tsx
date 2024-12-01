import React, {useState} from "react";
import FlatCard from "./FlatCard.tsx";
import SearchBar from "./SearchBar";
import api from "../api.ts";
import {Box} from "@mui/material";

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

const FlatSearch: React.FC = () => {
    const [flats, setFlats] = useState<Flat[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

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
    }, []);

    // Фильтруем квартиры
    const filteredFlats = filterFlats(flats, searchQuery);

    return (
        <Box width={"100%"} display="flex" flexDirection="column" alignItems="center">

        <Box maxWidth={600} >
            <SearchBar onSearch={handleSearch} />
            <Box width={"100%"}>
                {filteredFlats.map(flat => (
                    <FlatCard key={flat.id} flat={flat} canEdite={true} canEditeHouse={true} canEditeCoordinates={true} />
                ))}
            </Box>
        </Box>
        </Box>
    );
};
export default FlatSearch;
