import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchButtons from "./SearchButtons.tsx";

const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        onSearch(event.target.value);
    };

    const handleButtonClick = (field: string) => {
        const newQuery = query ? `${query}/${field}` : field;  // Если запрос не пустой, добавляем через '/'
        setQuery(newQuery);
        onSearch(newQuery);
    };

    return (
        <div>
            <TextField
                value={query}
                onChange={handleChange}
                variant="outlined"
                placeholder="Поиск"
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <SearchButtons onButtonClick={handleButtonClick} />
        </div>
    );


};
export default SearchBar;
