import React from 'react';
import {Box, Button} from '@mui/material';

const SearchButtons: React.FC<{ onButtonClick: (field: string) => void }> = ({ onButtonClick }) => {
    return (
        <Box display="flex" width="100%">
            <Box flex="0 0 50%"  textAlign="center">
                {/* Основные поля класса Flat */}
                <Button onClick={() => onButtonClick('id:')}>ID</Button>
                <Button onClick={() => onButtonClick('name:')}>Название</Button>
                <Button onClick={() => onButtonClick('creationDate:')}>Дата создания</Button>
                <Button onClick={() => onButtonClick('area:')}>Площадь</Button>
                <Button onClick={() => onButtonClick('price:')}>Цена</Button>
                <Button onClick={() => onButtonClick('balcony:')}>Балкон</Button>
                <Button onClick={() => onButtonClick('timeToMetroOnFoot:')}>До метро (мин)</Button>
                <Button onClick={() => onButtonClick('numberOfRooms:')}>Количество комнат</Button>
                <Button onClick={() => onButtonClick('isNew:')}>Новая</Button>
                <Button onClick={() => onButtonClick('furnish:')}>Отделка</Button>
                <Button onClick={() => onButtonClick('view:')}>Вид</Button>
                <Button onClick={() => onButtonClick('ownerId:')}>ID владельца</Button>
            </Box>

            <Box flex="0 0 25%"  textAlign="center">
                {/* Вложенные поля класса House */}
                <Button onClick={() => onButtonClick('house.name:')}>Дом (Название)</Button>
                <Button onClick={() => onButtonClick('house.year:')}>Год постройки</Button>
                <Button onClick={() => onButtonClick('house.numberOfFlatsOnFloor:')}>Квартир на этаже</Button>
            </Box>

            <Box flex="0 0 25%"   textAlign="center">
                {/* Вложенные поля класса Coordinates */}
                <Button onClick={() => onButtonClick('coordinates.x:')}>Координата X</Button>
                <Button onClick={() => onButtonClick('coordinates.y:')}>Координата Y</Button>
            </Box>

        </Box>
    );
};
export default SearchButtons;
