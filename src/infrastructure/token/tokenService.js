
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

module.exports = {
  sign:   (userId) => jwt.sign({ sub: userId }, jwtSecret, { expiresIn: '2h' }),
  verify: (token)  => jwt.verify(token, jwtSecret).sub,
};
