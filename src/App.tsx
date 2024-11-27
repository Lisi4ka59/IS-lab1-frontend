import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import HomePage from "./home/HomePage.tsx";
import AuthPage from "./auth/AuthPage.tsx";
import ActivationPage from "./auth/ActivationPage.tsx";
import {createTheme, ThemeProvider} from "@mui/material";
import FlatForm from "./flat/FlatForm.tsx";
import PaginatedFlatList from "./flat/FlatList.tsx";


const theme = createTheme({
    palette: {
        mode: 'dark',  // Используем темную палитру
    },
});


const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/auth" element={<AuthPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/activate" element={<ActivationPage/>}/>
                    <Route path="/flat/create" element={<FlatForm/>}/>


                    <Route path="/flat/all" element={<PaginatedFlatList/>}/>

                    <Route path="*" element={<Navigate to="/" />} />



                    {/* Добавьте другие маршруты, если нужно */}
                </Routes>
            </Router>
        </ThemeProvider>

    );
};

export default App;
