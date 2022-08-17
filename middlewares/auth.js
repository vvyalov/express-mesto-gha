const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  const jwtKey = '62e90cd9d7cbfdc9705395ce';
  const authorization = req.cookies;

  if (!authorization) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  const token = authorization.jwt;
  let payload;

  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
