import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./home/HomePage.tsx";
import AuthPage from "./auth/AuthPage.tsx";
import ActivationPage from "./auth/ActivationPage.tsx";
import {createTheme, ThemeProvider} from "@mui/material";

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
                    <Route path="/auth" element={<AuthPage/>} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/activate" element={<ActivationPage />} />

                    {/* Добавьте другие маршруты, если нужно */}
                </Routes>
            </Router>
        </ThemeProvider>

    );
};

export default App;
