const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  const authorization = req.cookies;

  if (!authorization) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  const token = authorization.jwt;
  let payload;

  try {
    payload = jwt.verify(token, '62e90cd9d7cbfdc9705395ce');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
