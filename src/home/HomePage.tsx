import { Box, Typography } from '@mui/material';
import PaginatedFlatList from "../flat/FlatList.tsx";
import React from "react";

const HomePage: React.FC = () => {

    return (

        <Box sx={{ width: "100wv", mx: 'auto', mt: 2, p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Все квартиры
            </Typography>
            <PaginatedFlatList/>
        </Box>
    );
};

export default HomePage;
