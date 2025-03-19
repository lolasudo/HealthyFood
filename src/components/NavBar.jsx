import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    IconButton, 
    Container, 
    Box, 
    Menu, 
    MenuItem, 
    useMediaQuery,
    styled
  } from '@mui/material';
  import { Menu as MenuIcon, Restaurant, AccountCircle } from '@mui/icons-material';
  import { useState } from 'react';
  import { Link } from 'react-router-dom';
  import { theme } from '../theme';
  import AuthModal from './ProfileAuth/AuthModal'; // Импортируем модальное окно
  
  const NavButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(0, 1),
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        color: theme.palette.primary.main
    }
  }));
  
  const NavBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // Состояние для модального окна
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
  
    const handleOpenModal = () => {
        setModalOpen(true); // Открыть модальное окно
    };
  
    const handleCloseModal = () => {
        setModalOpen(false); // Закрыть модальное окно
    };
  
    return (
        <>
            <AppBar position="sticky" color="default" elevation={1}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* Логотип и название */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                            <Restaurant sx={{ 
                                color: theme.palette.primary.main, 
                                fontSize: 32, 
                                mr: 1 
                            }}/>
                            <Typography
                                variant="h6"
                                noWrap
                                component={Link}
                                to="/"
                                sx={{
                                    fontFamily: 'Pacifico, cursive',
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textDecoration: 'none'
                                }}
                            >
                                HealthyFoods
                            </Typography>
                        </Box>
  
                        {isMobile ? (
                            <>
                                <IconButton
                                    size="large"
                                    color="inherit"
                                    onClick={handleMenuOpen}
                                    sx={{ ml: 'auto' }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem 
                                        component={Link} 
                                        to="/recipes" 
                                        onClick={handleMenuClose}
                                    >
                                        Рецепты
                                    </MenuItem>
                                    <MenuItem 
                                        component={Link} 
                                        to="/forum" 
                                        onClick={handleMenuClose}
                                    >
                                        Форум
                                    </MenuItem>
                                    <MenuItem 
                                        component={Link} 
                                        to="/about" 
                                        onClick={handleMenuClose}
                                    >
                                        О нас
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                {/* Навигационные ссылки для десктопа */}
                                <Box sx={{ display: 'flex', flexGrow: 1, ml: 3 }}>
                                    <NavButton
                                        component={Link}
                                        to="/recipes"
                                        color="inherit"
                                    >
                                        Рецепты
                                    </NavButton>
                                    <NavButton
                                        component={Link}
                                        to="/forum"
                                        color="inherit"
                                    >
                                        Форум
                                    </NavButton>
                                    <NavButton
                                        component={Link}
                                        to="/about"
                                        color="inherit"
                                    >
                                        О нас
                                    </NavButton>
                                </Box>
  
                                {/* Иконка профиля с модальным окном */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton
                                        size="large"
                                        color="inherit"
                                        onClick={handleOpenModal} // Открываем модальное окно
                                    >
                                        <AccountCircle fontSize="large" />
                                    </IconButton>
                                </Box>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
  
            {/* Модальное окно */}
            <AuthModal open={modalOpen} handleClose={handleCloseModal} />
        </>
    );
  };
  
  export default NavBar;
  