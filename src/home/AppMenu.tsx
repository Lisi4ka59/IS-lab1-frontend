import React, {useState, useEffect} from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Menu,
    MenuItem,
    Typography,
    Box,
    Popover,
} from '@mui/material';
import {
    Home as HomeIcon,
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";


const AppMenu: React.FC = () => {
    const [anchorElOptions, setAnchorElOptions] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [user, setUser] = useState<any>(null);
    const [exit, setExit] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        // Получаем информацию о пользователе из localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData)); // Преобразуем строку JSON в объект
            setExit(false);
        } else {
            // Если нет данных о пользователе, редиректим на страницу логина
            setExit(true);
            navigate('/auth');
        }
    }, [navigate]);

    // Открытие/закрытие меню дополнительных опций
    const handleOptionsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElOptions(event.currentTarget);
    };
    const handleOptionsMenuClose = () => {
        setAnchorElOptions(null);
    };

    // Открытие/закрытие поповера пользователя
    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleUserMenuClose = () => {
        setAnchorElUser(null);
    };

    // Выход пользователя
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setExit(true);

        navigate('/auth'); // Перенаправление на страницу логина после выхода

    };

    // Переход в профиль пользователя
    const goToProfile = () => {
        navigate(`/profile`); // Используем ID пользователя для перехода
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{justifyContent: 'space-between'}}>
                {/* Левая часть меню */}
                <Box display="flex" alignItems="center">
                    <IconButton color="inherit" onClick={() => navigate("/")}>
                        <HomeIcon/>
                    </IconButton>
                    <Button color="inherit" onClick={() => navigate("/flat/create")}>
                        Создать квартиру
                    </Button>
                    <Button color="inherit" onClick={() => console.log('Поиск квартиры')}>
                        Поиск квартиры
                    </Button>
                    <Button color="inherit" onClick={handleOptionsMenuOpen}>
                        Дополнительные опции
                    </Button>
                    <Menu
                        anchorEl={anchorElOptions}
                        open={Boolean(anchorElOptions)}
                        onClose={handleOptionsMenuClose}
                    >
                        <MenuItem onClick={() => console.log('Расчет среднего значения комнат')}>
                            Расчет среднего значения комнат
                        </MenuItem>
                        <MenuItem onClick={() => console.log('Найти квартиру с максимальной площадью')}>
                            Найти квартиру с максимальной площадью
                        </MenuItem>
                        <MenuItem onClick={() => console.log('Найти количество новых квартир')}>
                            Найти количество новых квартир
                        </MenuItem>
                        <MenuItem onClick={() => console.log('Самая дорогая квартира без балкона')}>
                            Самая дорогая квартира без балкона
                        </MenuItem>
                        <MenuItem onClick={() => console.log('Выбрать из трёх квартир наиболее дорогую')}>
                            Выбрать из трёх квартир наиболее дорогую
                        </MenuItem>
                    </Menu>
                </Box>
                {!exit && (
                    <>
                        {/* Правая часть меню */}
                        <Box display="flex" alignItems="center">
                            {/* Имя пользователя */}
                            {user && (
                                <Typography variant="body1" sx={{marginRight: 2}}>
                                    {user.username}
                                </Typography>
                            )}
                            {/* Иконка пользователя */}
                            <IconButton
                                onClick={handleUserMenuOpen}
                                color="inherit"
                            >
                                <AccountCircleIcon/>
                            </IconButton>
                            <Popover
                                open={Boolean(anchorElUser)}
                                anchorEl={anchorElUser}
                                onClose={handleUserMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <Box p={2} width={200}>
                                    {user && (
                                        <>
                                            <Typography variant="subtitle1"><strong>{user.name} {user.surname}</strong></Typography>
                                            <Typography variant="body2">{user.email}</Typography>
                                            <Typography variant="body2">{user.phoneNumber}</Typography>
                                            <Typography variant="body2" sx={{mt: 1}}>{user.aboutUser}</Typography>
                                            <Box mt={2} display="flex" flexDirection="column" gap={0}>
                                                <Button
                                                    startIcon={<PersonIcon/>}
                                                    onClick={goToProfile}
                                                    color="primary"
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        textTransform: 'none',
                                                        backgroundColor: 'transparent',
                                                        color: 'inherit',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.1)', // Лёгкий эффект при наведении
                                                        },
                                                    }}
                                                >
                                                    Профиль
                                                </Button>
                                                <Button
                                                    startIcon={<ExitToAppIcon/>}
                                                    onClick={handleLogout}
                                                    color="error"
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        textTransform: 'none',
                                                        backgroundColor: 'transparent',
                                                        color: 'red', // Красный шрифт
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 0, 0, 0.1)', // Лёгкий эффект при наведении
                                                        },
                                                    }}
                                                >
                                                    Выйти
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Popover>
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar>
    )
        ;
};

export default AppMenu;
