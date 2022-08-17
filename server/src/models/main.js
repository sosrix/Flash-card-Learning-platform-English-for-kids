const mongoose = require("mongoose");

const MainSchema = mongoose.Schema({
  //ID
  random_token: {
    type: String,
    require: true,
  },
  en_word: {
    type: String,
    require: true,
  },
  translate_of_word: {
    type: String,
    require: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  important: {
    type: Number,
    require: true,
  },
  example: {
    type: Array,
    require: false,
  },
  image_url: {
    type: String,
    require: false,
  },
  t_times: {
    type: Number,
    default: 0,
  },
  f_times: {
    type: Number,
    default: 0,
  },
  n_times: {
    type: Number,
    default: 0,
  },
  r_again: {
    type: Number,
    default: 1, //2 means soon // 1 means yeah // 0 means a bit
  },
  date_finish: {
    type: Date,
    default: new Date(),
  },
  date: {
    type: Date,
    default: new Date(),
  },
});
module.exports = mongoose.model("Main", MainSchema);
