import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from "./home/HomePage.tsx";
import AuthPage from "./auth/AuthPage.tsx";
import ActivationPage from "./auth/ActivationPage.tsx";
import {createTheme, ThemeProvider} from "@mui/material";
import FlatForm from "./flat/FlatForm.tsx";
import CoordinatesForm from "./flat/CoordinatesForm.tsx";
import HouseForm from "./flat/HouseForm.tsx";

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
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage/>} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/activate" element={<ActivationPage />} />
                    <Route path="/flat/create" element={<FlatForm />} />



                    <Route path="/flat/cr" element={<CoordinatesForm />} />
                    <Route path="/flat/c" element={<HouseForm />} />




                    {/* Добавьте другие маршруты, если нужно */}
                </Routes>
            </Router>
        </ThemeProvider>

    );
};

export default App;
