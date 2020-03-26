const jwt = require("jsonwebtoken");

module.exports = function () {
  return {
    generateToken: (dataset) => {
      return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (15 * 60),
        data: dataset
      }, 'InhaleInHellItsHeaven');
    },
    verifyToken: function (token) {
      try {
        const isVerified = jwt.verify(token, 'InhaleInHellItsHeaven');
        return true;
      } catch (e) {
        return false;
      }
    }
  }
};