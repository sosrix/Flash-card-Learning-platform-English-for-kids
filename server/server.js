const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//The env
require("dotenv").config();
const port = 5000;
const dbURL = "mongodb://localhost:27017/flash";

//Connect with the mongo DB
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

//express
const app = express();

//Cors middleware
app.use(cors());

// use json
app.use(express.json());

const mainController = require("./src/controllers/main");
const userController = require("./src/controllers/user");

//Express routers - APIs
app.get("/", mainController.get);
app.get("/newuser", userController.newUser); //get answer
app.get("/getanswer/:id", mainController.getAnswer); //get answer
app.get("/examples/:id", mainController.getExamples); //get examples
app.post("/", mainController.checkMyAnswer);
app.put("/", mainController.thePut);

app.get("/inf", userController.inf);
app.post("/moreInf", userController.moreInf);

app.listen(port, () => {
  console.log(`The API serve runing in PORT ${port}`);
});
