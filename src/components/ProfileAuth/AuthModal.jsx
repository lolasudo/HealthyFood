import { Modal, Box, Typography, Button, TextField, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { useState } from 'react';

const AuthModal = ({ open, handleClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между авторизацией и регистрацией
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(''); // Для обработки ошибок
  const [user, setUser] = useState(null); // Для хранения данных пользователя
  const [token, setToken] = useState(''); // Для хранения JWT токена
  const [openProfileModal, setOpenProfileModal] = useState(false); // Состояние для нового модального окна

  // Данные для профиля
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Проверка на совпадение пароля для регистрации
    if (!isLogin && password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      let response;

      // Если форма для входа
      if (isLogin) {
        console.log("Sending login request...");
        response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      } else {
        // Если форма для регистрации
        console.log("Sending registration request...");
        response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // Успех, сохраняем токен и данные пользователя
        setToken(data.token);  // Сохраняем токен
        setUser(data.user);    // Сохраняем данные пользователя
        handleClose();         // Закрываем окно после успешной отправки
        setOpenProfileModal(true);  // Открываем новое окно для ввода данных
      } else {
        // Ошибка
        setError(data.message || 'Что-то пошло не так');
      }
    } catch (err) {
      setError('Ошибка сети');
      console.error("Network error:", err);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin); // Переключение между авторизацией и регистрацией
    setError(''); // Сбрасываем ошибки при переключении форм
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Здесь можешь добавить логику для отправки данных о пользователе на сервер или локальное сохранение
    console.log("Profile data submitted", { name, weight, height });
    setOpenProfileModal(false);  // Закрыть окно после отправки данных
  };

  return (
    <div>
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
          {user ? (
            // Если пользователь авторизован, показываем его данные
            <Box>
              <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                Добро пожаловать, {user.name}!
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Email: {user.email}
              </Typography>
              <Button onClick={handleClose} sx={{ mt: 3 }} fullWidth variant="contained">
                Закрыть
              </Button>
            </Box>
          ) : (
            // Если пользователь не авторизован, показываем форму авторизации/регистрации
            <Box>
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
          )}
        </Box>
      </Modal>

      {/* Новый модал для ввода данных профиля */}
      <Modal open={openProfileModal} onClose={() => setOpenProfileModal(false)}>
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
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Заполните свои данные
          </Typography>

          <form onSubmit={handleProfileSubmit}>
            <TextField
              label="Ваше имя"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Ваш вес (кг)"
              type="number"
              fullWidth
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Ваш рост (см)"
              type="number"
              fullWidth
              required
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              Сохранить
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AuthModal;
