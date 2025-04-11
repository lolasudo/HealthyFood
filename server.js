import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // если используешь Node < 18

dotenv.config(); // Загружаем переменные окружения
console.log('GigaChat API KEY:', process.env.GIGACHAT_TOKEN);
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const GIGACHAT_API_URL = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch(GIGACHAT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': process.env.GIGACHAT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GigaChat error:', data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Ошибка сервера:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`🔐 GigaChat Token loaded: ${!!process.env.GIGACHAT_TOKEN}`);
});
