// Layout.tsx
import React from 'react';
import AppMenu from './home/AppMenu'; // Импорт компонента меню
import { Box } from '@mui/material';

interface LayoutProps {
    children: React.ReactNode; // Область для вставки контента
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Box display="flex" flexDirection="column" height="100vh" width="100vw">
            {/* Верхнее меню */}
            <AppMenu />
            {/* Контент страниц */}
            <Box flex="1" p={2} overflow="auto">
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
