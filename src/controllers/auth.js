const register = (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const result = {
    message: "Register Success",
    data: {
      uid: 1,
      name: name,
      email: email,
      password: password,
    },
  };
  res.status(201).json(result);
  next();
};

module.exports = { register };
