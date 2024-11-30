import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import HomePage from "./home/HomePage.tsx";
import AuthPage from "./auth/AuthPage.tsx";
import ActivationPage from "./auth/ActivationPage.tsx";
import {createTheme, ThemeProvider} from "@mui/material";
import FlatForm from "./flat/FlatForm.tsx";
import Layout from './Layout';
import UserProfile from "./user/UserProfile.tsx";
import AverageNumberOfRooms from "./advanced-flat/AverageNumberOfRooms.tsx";
import FlatWithMaxArea from "./advanced-flat/FlatWithMaxArea.tsx";
import FlatsCountByIsNew from "./advanced-flat/FlatsCountByIsNew.tsx";
import MostExpensiveFlatWithoutBalcony from "./advanced-flat/MostExpensiveFlatWithoutBalcony.tsx";
import MostExpensiveFlatFromIds from "./advanced-flat/MostExpensiveFlatFromIds.tsx"; // Импорт Layout-компонента


const theme = createTheme({
    palette: {
        mode: 'dark',  // Используем темную палитру
    },
});


const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/auth" element={<AuthPage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/activate" element={<ActivationPage/>}/>
                        <Route path="/flat/create" element={<FlatForm/>}/>
                        <Route path="/profile" element={<UserProfile/>}/>
                        <Route path="/average-number-of-rooms" element={<AverageNumberOfRooms/>}/>
                        <Route path="/flat-with-max-area" element={<FlatWithMaxArea/>}/>
                        <Route path="/flats-count-by-is-new" element={<FlatsCountByIsNew/>}/>
                        <Route path="/most-expensive-flat-without-balcony" element={<MostExpensiveFlatWithoutBalcony/>}/>
                        <Route path="/most-expensive-flat-from-ids" element={<MostExpensiveFlatFromIds/>}/>

                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>

    );
};

export default App;
