const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Импорт маршрутов
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");
const axios = require('axios');
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

// Если используется сборка, отдаем статические файлы
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());

// Пример простого эндпоинта для проверки работоспособности сервера
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// WebSocket-соединение
io.on('connection', (socket) => {
  console.log('Пользователь подключился к WebSocket');

  socket.on('chat message', async (msg) => {
    console.log("Получено сообщение:", msg);
    try {
      // Прокси-запрос к API GigaChat (замените URL и параметры согласно документации)
      const response = await axios.post("https://api.sberbank.ru/gigachat", {
        message: msg
      });
      const reply = response.data.reply || "Нет ответа от GigaChat";
      // Отправка ответа клиенту
      socket.emit('chat response', reply);
    } catch (error) {
      console.error("Ошибка обращения к GigaChat:", error);
      socket.emit('chat response', "Ошибка обращения к GigaChat");
    }
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился от WebSocket');
  });
});

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
