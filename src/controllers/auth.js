const Auth = require('../models/auth');
const passwordHash = require('password-hash');

const register = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password + '020100';
  const hashedPassword = passwordHash.generate(password);

  const Registrasi = new Auth({
    username: username,
    password: hashedPassword,
  });
  Auth.findOne({ username: username }).then((result) => {
    if (result) {
      const error = new Error(`Username ${username} sudah terdaftar`);
      error.errorStatus = 404;
      // throw error;
      res.status(400).json({
        message: 'Username sudah terdaftar',
        data: null,
      });
    } else {
      Registrasi.save()
        .then((result) => {
          res.status(201).json({
            message: 'User created',
            data: result,
          });
        })
        .catch((error) => console.log(error));
    }
  });
};

const login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password + '020100';
  Auth.findOne({ username })
    .then((result) => {
      if (result) {
        const passwordHashed = result.password;
        if (passwordHash.verify(password, passwordHashed)) {
          res.status(400).json({
            message: 'Login sukses',
            data: null,
          });
        } else {
          res.status(400).json({
            message: 'Password salah',
            data: null,
          });
        }
      } else {
        res.status(400).json({
          message: 'Username tidak terdaftar',
          data: null,
        });
      }
    })
    .catch((error) => console.log(error));
};

module.exports = { register, login };
