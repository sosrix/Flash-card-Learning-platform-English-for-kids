const User = require('../models/user')
const Main = require('../models/main');


var rand = function() {
  return Math.random().toString(36).substr(2);
};
      

exports.newUser = async (req, res) => {
    

    let token = rand()+rand()+rand();

    const newUser = new User({
      token: token
    })
    
    try {
      
      const save = await newUser.save();
      res.status(200).json(save);

      
    } catch (err) {
      console.log('false', err)
    }

}


exports.inf = async (req, res) => {

  User.findOne({}, {}, { sort: { 'date' : -1 } }, function(err, post) {
    
    let resData = {
      know: post.n_know,
      seen: post.n_seen,
      finish: post.n_completed,
      all: 2265,
    }

    res.status(200).json(resData);

  });
}

exports.moreInf = async (req, res) => {
  let body = req.body;
  if(body) {

    if(body.review) {
      const kwon = await Main.find({t_times: {$gte: 3}, used: false});
      kwon.filter((el) => el.t_times - 3*el.f_times >= 0);
      res.status(200).json(kwon);
    } else if(body.seen) {
      const seen = await Main.find({n_times: {$gte: 1}})
      res.status(200).json(seen);
    } else if (body.know) {

      const kwon = await Main.find({t_times: {$gte: 3}});
      kwon.filter((el) => el.t_times - 3*el.f_times >= 0);
      res.status(200).json(kwon);
    
    } else if (body.finish) {
    
      const finish = await Main.find({used: true});
      res.status(200).json(finish);
    
    } else if(body.all){
      const all = await Main.find({})
      res.status(200).json(all);
    } else {

      res.status(200).json([]);
    }
  
    
  }
}
