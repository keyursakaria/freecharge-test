const Validator = require("validatorjs");
const bcrypt = require("bcrypt");
const util = require("../util/token")();
module.exports = function (sequelize) {
  const User = require("../models/user")(sequelize);
  const userController = {
    login: async (req, res) => {
      // data validation
      let rules = {
        email: 'required|email',
        password: 'required'
      };
      let validation = new Validator(req.body, rules);
      if (validation.fails()) {
        res.status(400).json({
          message: validation.errors.all()
        });
        return;
      }

      // check whether email exists
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      });

      if (!user) {
        res.status(400).json({
          message: "Invalid email id"
        });
      }

      // check for password - salt match
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!isMatch) {
        res.status(400).json({
          message: "Invalid passowrd"
        });
      }
      const token = util.generateToken({});
      res.status(200).json({
        message: "success",
        token: token
      });
    },
    register: async (req, res) => {
      let rules = {
        name: 'required',
        email: 'required|email',
        age: 'min:18',
        password: 'required|confirmed'
      };
      const validation = new Validator(req.body, rules);
      if (validation.fails()) {
        res.status(400).json({
          message: validation.errors.all()
        });
        return;
      }
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        age: req.body.age
      });

      if (!user instanceof User) {
        res.status(500).json({
          message: "something went wrong"
        });
        return;
      }
      res.status(200).json({
        message: "success"
      })
    },
    validateToken: async (req, res) => {
      let rules = {
        token: 'required',
      };
      const validation = new Validator(req.body, rules);
      if (validation.fails()) {
        res.status(400).json({
          message: validation.errors.all()
        });
        return;
      }
      const checkToken = util.verifyToken(req.body.token);
      if (checkToken) {
        res.status(200).json({
          message: "valid"
        });
      } else {
        // Invalid with new token
        const token = util.generateToken({});
        res.status(200).json({
          message: "invalid",
          token: token
        });
      }
    }
  };
  return userController;
};
