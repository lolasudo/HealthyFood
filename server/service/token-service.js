const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId });
        if (tokenData) {
            // Используем $set для обновления токена (избегаем ошибки)
            await tokenModel.updateOne({ user: userId }, { $set: { refreshToken } });
            return tokenModel.findOne({ user: userId });
        }
        return tokenModel.create({ user: userId, refreshToken });
    }
}

module.exports = new TokenService();
