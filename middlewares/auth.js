const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  const jwtKey = '62e90cd9d7cbfdc9705395ce';
  const auth = req.cookies;
  if (!auth) {
    next(new AuthError('Необходимо авторизоваться'));
    return;
  }

  const token = auth.jwt;
  let payload;

  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    next(new AuthError('Необходимо авторизоваться'));
    return;
  }

  req.user = payload;
  next();
};
