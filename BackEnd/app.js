const path = require('path');
const express = require('express');
const feedRoutes = require('./routers/feed');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');

const app = express();


const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
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


const MONGODB_URL = 'mongodb+srv://vvm1004:test123@cluster0.4a2h5sc.mongodb.net/messages?retryWrites=true&w=majority';


// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose.connect(MONGODB_URL)
  // mongoose.connect("mongodb://127.0.0.1:27017/network")
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err)
  });

