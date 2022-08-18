const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  const authorization = req.cookie;

  if (!authorization) {
    throw new AuthError('Необходима авторизация');
  }

  const token = authorization.jwt;
  let payload;

  try {
    payload = jwt.verify(token, '62e90cd9d7cbfdc9705395ce');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
