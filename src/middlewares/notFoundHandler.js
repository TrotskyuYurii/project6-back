//Функція обробки помилок у разі відсутності маршруту
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
};
