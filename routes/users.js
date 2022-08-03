const router = require('express').Router();
const {
  allUsers, getUser, newUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', allUsers);
router.get('/users/:userId', getUser);
router.post('/users', newUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
