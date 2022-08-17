const mongoose = require("mongoose");

//The env
require("dotenv").config();

// Your MongoDB database url here

const dbURL = "mongodb://localhost:27017/flash";
const Main = require("./src/models/main");
const User = require("./src/models/user");

//Connect with the mongo DB
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const readXlsxFile = require("read-excel-file/node");

var rand = function () {
  return Math.random().toString(36).substr(2);
};

readXlsxFile(__dirname + "/en.xlsx").then((rows) => {
  var add = 2500;
  rows.forEach((el) => {
    (async () => {
      let row = el;
      let random = rand();
      const newMain = new Main({
        random_token: random,
        en_word: row[1],
        translate_of_word: row[5],
        important: row[2] + add,
      });

      add--;

      try {
        const save = await newMain.save();
        console.log(save);
      } catch (err) {
        console.log("false", err);
      }
    })();
  });

  let token = rand() + rand() + rand();

  const newUser = new User({
    token: token,
  });

  try {
    newUser.save();
  } catch (err) {
    console.log("false", err);
  }
});
