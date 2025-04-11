import { Modal, Box, Typography, Button, TextField, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { useState } from 'react';

const AuthModal = ({ open, handleClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между авторизацией и регистрацией
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(''); // Для обработки ошибок

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на совпадение пароля для регистрации
    if (!isLogin && password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      let response;

      // Если форма для входа
      if (isLogin) {
        response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      } else {
        // Если форма для регистрации
        response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        // Успех
        console.log(data);
        handleClose(); // Закрыть окно после успешной отправки
      } else {
        // Ошибка
        setError(data.message || 'Что-то пошло не так');
      }
    } catch (err) {
      setError('Ошибка сети');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin); // Переключение между авторизацией и регистрацией
    setError(''); // Сбрасываем ошибки при переключении форм
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
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
          {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
        </Typography>

        {error && (
          <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
            {error}
          </Typography>
        )}

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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}

          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
            label="Запомнить меня"
            sx={{ mt: 2 }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
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
