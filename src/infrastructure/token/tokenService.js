
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

module.exports = {
  sign:   (userId) => jwt.sign({ sub: userId }, jwtSecret, { expiresIn: '1y' }),
  verify: (token)  => jwt.verify(token, jwtSecret).sub,
};
