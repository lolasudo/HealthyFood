const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) return res.status(400).json({ message: 'Пользователь уже существует' });

    const hashPassword = await bcrypt.hash(password, 5);
    const activationLink = uuidv4();

    const user = await User.create({
      email,
      password: hashPassword,
      activationLink,
    });

    const link = `${process.env.API_URL}/api/auth/activate/${activationLink}`;
    await sendEmail(email, link);

    return res.status(201).json({ message: 'Письмо активации отправлено на email' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
};

const activate = async (req, res) => {
  try {
    const user = await User.findOne({ activationLink: req.params.link });
    if (!user) return res.status(400).json({ message: 'Некорректная ссылка активации' });

    user.isActivated = true;
    await user.save();

    return res.redirect(process.env.CLIENT_URL);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка активации' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Пользователь не найден' });
    if (!user.isActivated) return res.status(400).json({ message: 'Аккаунт не активирован' });

    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) return res.status(400).json({ message: 'Неверный пароль' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка входа' });
  }
};

module.exports = { register, activate, login };
