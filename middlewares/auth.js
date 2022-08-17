const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  const jwtKey = '62e90cd9d7cbfdc9705395ce';
  const auth = req.cookies;
  if (!auth) {
    throw new AuthError('Необходимо авторизоваться');
  }

  const token = auth.jwt;
  let payload;

  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    throw new AuthError('Необходимо авторизоваться');
  }

  req.user = payload;
  next();
};
