import { Modal, Box, Typography, Button, TextField, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { useState } from 'react';

const AuthModal = ({ open, handleClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между авторизацией и регистрацией
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика для отправки данных авторизации/регистрации
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember Me:', rememberMe);
    handleClose(); // Закрыть окно после отправки
  };

  const toggleForm = () => {
    setIsLogin(!isLogin); // Переключение между авторизацией и регистрацией
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}
      >
        <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
          {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          
          {!isLogin && (
            <TextField
              label="Подтвердите пароль"
              type="password"
              fullWidth
              required
              sx={{ mt: 2 }}
            />
          )}

          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
            label="Запомнить меня"
            sx={{ mt: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Button onClick={toggleForm} sx={{ textTransform: 'none' }}>
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти'}
          </Button>
        </Grid>

        <Button onClick={handleClose} sx={{ mt: 2 }} fullWidth variant="outlined">
          Закрыть
        </Button>
      </Box>
    </Modal>
  );
};

export default AuthModal;
