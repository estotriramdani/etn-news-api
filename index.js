const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
app.use('/images', express.static(path.join(__dirname, 'images')));
const bodyParser = require('body-parser');

const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');
const port = process.env.PORT || 4000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());

app.use(multer({ storage, fileFilter }).single('image'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  next();
});

app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://estotriramdani:wi5FPjdPgjN0qkAf@cluster0.gupjv.mongodb.net/article?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(port, () => console.log('Connection success'));
    module.exports = app;
  })
  .catch((err) => console.log(err));
