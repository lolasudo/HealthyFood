const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Модель пользователя
const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка, существует ли уже пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12);

    // Создание нового пользователя
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Генерация JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Авторизация пользователя
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Сравнение пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Генерация JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
