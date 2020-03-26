const express = require("express");
const Sequelize = require("sequelize");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// ORM with sqlite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

sequelize.sync().then(function () {
  console.log("DB Initialized");
});

const userController = require("./controller/user")(sequelize);

app.post("/login", userController.login);
app.post("/register", userController.register);
app.post("/validate-token", userController.validateToken);

app.listen(port, () => console.log(`Application started on port ${port}!`));
