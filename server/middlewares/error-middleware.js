const ApiError = require('../exceptions/api-error');

module.exports = function(err, req, res, next) {
  // Явно указываем Content-Type как JSON
  res.setHeader('Content-Type', 'application/json');

  // Обработка ApiError
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors,
    });
  }

  // Все остальные ошибки
  return res.status(500).json({ 
    message: 'Непредвиденная ошибка',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
};