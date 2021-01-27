let Signin = require("../schema/signin");

let authenticate = (req, res, next) => {
  if (req.body.cookies.username && req.body.cookies.password) {
    Signin.findOne({
      username: req.body.cookies.username,
      password: req.body.cookies.password,
    })
      .then((user) => {
        if (!user) {
          res.statusCode = 203;
          res.end("Username or password incorrect");
        } else {
          res.statusCode = 200;
          res.end(
            `username=${user.username}` +
              " %split% " +
              `password=${user.password}`
          );
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};

module.exports = authenticate;
