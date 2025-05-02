import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';

// Загружаем переменные окружения
dotenv.config();
const app = express();
const PORT = 3001;

// Разрешаем self-signed сертификаты для тестирования (не рекомендуется в production)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Включаем CORS и парсинг JSON
app.use(cors());
app.use(express.json());

// Выводим загруженные переменные окружения (без вывода полного значения токена)
console.log('⚙️ Конфигурация:');
console.log('- GIGACHAT_TOKEN: ' + (process.env.GIGACHAT_TOKEN ? '✅ загружен' : '❌ отсутствует'));
console.log('- GIGACHAT_CLIENT_ID: ' + (process.env.GIGACHAT_CLIENT_ID ? '✅ загружен' : '❌ отсутствует'));
console.log('- GIGACHAT_SCOPE: ' + (process.env.GIGACHAT_SCOPE || 'не указан, используем GIGACHAT_API_PERS'));

// Конфигурация для GigaChat
const AUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
const GIGACHAT_API_URL = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';
let accessToken = null;
let tokenExpiry = null;

// Функция для получения Access Token
async function getAccessToken() {
  try {
    // Проверяем, есть ли у нас действующий токен
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
      console.log('🔑 Используем существующий токен (действителен еще', Math.round((tokenExpiry - Date.now()) / 1000), 'сек)');
      return accessToken;
    }

    const requestId = uuidv4();
    console.log('🔄 Запрашиваем новый Access Token с RqUID:', requestId);

    // Формируем URL-encoded данные для запроса
    const formData = new URLSearchParams();
    formData.append('scope', process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS');

    // Проверка правильности токена
    if (!process.env.GIGACHAT_TOKEN || process.env.GIGACHAT_TOKEN.length < 10) {
      throw new Error('Неверный формат GIGACHAT_TOKEN');
    }

    // Делаем запрос на получение токена
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': requestId,
        'Authorization': `Basic ${process.env.GIGACHAT_TOKEN}` // Используем ключ авторизации
      },
      body: formData.toString(),
      agent: httpsAgent // Позволяет работать с self-signed сертификатами
    });

    // Полный ответ для логирования
    const responseText = await response.text();
    
    console.log('📡 Ответ сервера авторизации:', response.status);
    console.log('📝 Текст ответа:', responseText);

    // Пробуем распарсить JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      console.error('❌ Ошибка парсинга JSON:', err);
      throw new Error(`Получен некорректный ответ от сервера авторизации: ${responseText}`);
    }

    if (!response.ok) {
      console.error('❌ Ошибка получения токена:', response.status, data);
      throw new Error(`Ошибка получения токена: ${response.status}, сообщение: ${JSON.stringify(data)}`);
    }

    if (!data.access_token) {
      console.error('❌ Ответ не содержит access_token:', data);
      throw new Error('Ответ не содержит access_token');
    }

    // Сохраняем полученный токен
    accessToken = data.access_token;
    
    // Сохраняем время истечения токена (обычно 30 минут)
    const expiresIn = data.expires_in || 1800; // По умолчанию 30 минут, если не указано
    tokenExpiry = Date.now() + (expiresIn * 1000) - 60000; // Вычитаем 1 минуту для подстраховки
    
    console.log('✅ Access Token получен, истекает через:', expiresIn, 'секунд');
    return accessToken;
  } catch (error) {
    console.error('🚨 Ошибка аутентификации GigaChat:', error.message);
    throw error;
  }
}

// Middleware для проверки токена перед запросами
async function ensureToken(req, res, next) {
  try {
    await getAccessToken();
    next();
  } catch (error) {
    console.error('🚨 Ошибка обеспечения токена:', error);
    res.status(500).json({ 
      error: 'Ошибка аутентификации GigaChat',
      details: error.message
    });
  }
}

// Маршрут тестирования аутентификации
app.get('/api/auth/test', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({
      success: true,
      message: 'Аутентификация успешна',
      tokenInfo: {
        exists: !!token,
        expiresIn: tokenExpiry ? Math.round((tokenExpiry - Date.now()) / 1000) : null,
      }
    });
  } catch (error) {
    console.error('🚨 Тест аутентификации провален:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});

// Маршрут для запросов к GigaChat API
app.post('/api/chat', ensureToken, async (req, res) => {
  try {
    console.log('📤 Отправляем запрос к GigaChat API:', JSON.stringify(req.body));
    
    const response = await fetch(GIGACHAT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body),
      agent: httpsAgent
    });

    const data = await response.json();
    
    console.log('📥 Получен ответ от GigaChat API:', response.status);
    
    if (!response.ok) {
      console.error('❌ GigaChat API ошибка:', data);
      return res.status(response.status).json({
        error: 'Ошибка API GigaChat',
        details: data
      });
    }

    res.json(data);
  } catch (error) {
    console.error('🚨 Ошибка сервера при обработке запроса к API:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error.message
    });
  }
});

// Маршрут для получения списка доступных моделей
app.get('/api/models', ensureToken, async (req, res) => {
  try {
    console.log('📋 Запрашиваем список моделей GigaChat');
    
    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      agent: httpsAgent
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Ошибка получения моделей:', data);
      return res.status(response.status).json(data);
    }
    
    console.log('✅ Доступные модели:', data?.data?.map(model => model.id).join(', ') || 'информация недоступна');
    res.json(data);
  } catch (error) {
    console.error('🚨 Ошибка получения моделей:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при запросе моделей',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  
  // Выполняем тестовое получение токена при запуске
  console.log('🔄 Тестирование аутентификации...');
  getAccessToken()
    .then(() => console.log('✅ Тестовая аутентификация прошла успешно'))
    .catch(err => console.error('⚠️ Ошибка тестовой аутентификации:', err.message));
});