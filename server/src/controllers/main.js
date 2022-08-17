const Main = require("../models/main");
const User = require("../models/user");

const rate = (el) => {
  return el.important - 3 * el.t_times + 6 * el.t_times;
};

exports.get = async (req, res) => {
  let userData = await User.findOne({}, {}, { sort: { date: -1 } });

  let data = await Main.aggregate([
    { $match: { used: false } },
    { $sample: { size: 70 } },
  ]);

  let sData = data.sort((a, b) => rate(b) - rate(a));

  let answerArrId = Math.floor(Math.random() * 4);
  let answerId = sData[0]._id;

  let props = [];
  for (let i = 0; i < 4; i++) {
    if (i === answerArrId) {
      props.push({
        text: sData[0].translate_of_word,
        token: sData[0].random_token,
      });
    } else {
      let pop = data.pop();
      if (pop._id !== answerId) {
        props.push({
          text: pop.translate_of_word,
          token: pop.random_token,
        });
      } else {
        i--;
      }
    }
  }
  let { t_times, f_times, n_times } = sData[0];

  let resData = {
    id: answerId,
    question: sData[0].en_word,
    important: sData[0].important,
    t_times,
    f_times,
    n_times,
    props,
  };

  res.status(200).json(resData);

  let toUpdate = await Main.findById(sData[0]._id);
  if (toUpdate.n_times === 0) {
    userData.n_seen = ++userData.n_seen;
    userData.save();
  }
  toUpdate.n_times += 1;

  toUpdate.save();
};

const findById = (body, res, callback) => {
  if (body && body.id) {
    Main.findById(body.id, (err, data) => {
      if (!err && data) {
        callback(data, body);
      } else {
        res.status(200).json({ err: 1 });
      }
    });
  }
};

exports.getAnswer = (req, res) => {
  let body = {
    id: req.params.id,
  };

  findById(body, res, (data) => {
    res.status(200).json({ correct_token: data.random_token });
  });
};

exports.getExamples = (req, res) => {
  let body = {
    id: req.params.id,
  };

  findById(body, res, (data) => {
    res.status(200).json({ examples: data.example });
  });
};

exports.checkMyAnswer = async (req, res) => {
  let userData = await User.findOne({}, {}, { sort: { date: -1 } });

  let body = req.body;

  findById(body, res, (data, body) => {
    if (body.token && data.random_token === body.token) {
      res.status(200).json({ answer: true });

      //Todo: change this if
      if (
        data.t_times - 3 * data.f_times < 3 &&
        data.t_times + 1 - 3 * data.f_times >= 3
      ) {
        userData.n_know = ++userData.n_know;
        userData.save();
      }
      //Todo: end

      data.t_times += 1;
      data.save();
    } else {
      res.status(200).json({ answer: false, the_correct: body.token });

      //Todo: change this if
      if (
        data.t_times - 3 * data.f_times >= 3 &&
        data.t_times - 3 * (data.f_times + 1) < 3
      ) {
        userData.n_know = +userData.n_know - 1;
        userData.save();
      }
      //Todo: end

      data.f_times += 1;
      data.save();
    }
  });
};

exports.thePut = async (req, res) => {
  let userData = await User.findOne({}, {}, { sort: { date: -1 } });

  let body = req.body;
  if (body && body.id) {
    let getToPut = await Main.findById(body.id);

    if (getToPut) {
      //HERE
      if (body.t_times || body.i_use_this) {
        //Todo: change this if
        if (
          getToPut.t_times - 3 * getToPut.f_times < 3 &&
          getToPut.t_times + 1 - 3 * getToPut.f_times >= 3
        ) {
          userData.n_know = ++userData.n_know;
          userData.save();
        }
        //Todo: end

        getToPut.t_times += 1;
      }

      if (body.f_times) {
        //Todo: change this if
        if (
          getToPut.t_times - 3 * getToPut.f_times >= 3 &&
          getToPut.t_times - 3 * (getToPut.f_times + 1) < 3
        ) {
          userData.n_know = +userData.n_know - 1;
          userData.save();
        }
        //Todo: end

        getToPut.f_times += 1;
      }

      if (body.i_use_this) {
        //Todo: change this if
        if (getToPut.t_times - 3 * getToPut.f_times < 3) {
          userData.n_know = ++userData.n_know;
        }
        userData.n_completed = ++userData.n_completed;
        userData.save();
        //Todo: end

        getToPut.used = true;
        getToPut.date_finish = new Date();
      }

      if (body.example) {
        //Todo: change this if
        if (
          getToPut.t_times - 3 * getToPut.f_times < 3 &&
          getToPut.t_times + 1 - 3 * getToPut.f_times >= 3
        ) {
          userData.n_know = ++userData.n_know;
          userData.save();
        }
        //Todo: end

        let arr = getToPut.example;
        arr.push(body.example);

        getToPut.example = arr;
        getToPut.t_times += 1;
      }

      getToPut.save();
      res.status(201).json({ put: true });

      //END HERE
    } else {
      res.status(201).json({ put: false });
    }
  }
};
