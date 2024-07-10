//Функція обробки помилок у разі відсутності маршруту
export const notFoundHandler = (req, res) => {
    res.status(404).send('Oops! Route was not found!');
  };