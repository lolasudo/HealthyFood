const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Импорт маршрутов
const app = express();

// Загружаем переменные окружения из файла .env
dotenv.config();

// Настройка CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Разрешаем доступ с фронтов на этих портах
  methods: 'GET,POST', // Разрешаем только эти методы
  credentials: true, // Разрешаем отправку cookies
};

app.use(cors(corsOptions)); // Применяем CORS на все запросы

// Middleware
app.use(express.json()); // Для парсинга JSON в теле запроса

// Соединение с базой данных MongoDB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Маршруты
app.use('/api/auth', authRoutes); // Используем маршруты авторизации

// Запуск сервера
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
