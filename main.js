const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.json());

// ORM with sqlite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Creates the tables
sequelize.sync().then(function () {
  console.log("DB Initialized");
});

// Controller where all logic sits
const userController = require("./controller/user")(sequelize);


// All the routes
app.post("/login", userController.login);
app.post("/register", userController.register);
app.post("/validate-token", userController.validateToken);

app.listen(port, () => console.log(`Application started on port ${port}!`));
