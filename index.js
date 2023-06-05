require('dotenv').config();
const { authKey, authGet, authAddUser } = require('./middleware/middleware');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3011;
const { UserModel } = require('./models/UserModel');

app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://futuris.netlify.app,https://futuris.herokuapp.com/');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Routes go here
app.get(
  '/:key/:email',
  [authGet(), authKey(process.env.PASSWORD)],
  (req, res) => {
    const query = UserModel.findOne({ email: req.params.email });
    query.select('-password');
    query.exec(function (err, user) {
      if (err) {
        console.log(err);
      }
      res.json(user);
      console.log(user);
    });
    // console.log(user);
  }
);

app.get(
  '/:key/newsApi/crypto',
  [authKey(process.env.PASSWORD)],
  async (req, res) => {
    console.log('a')
    const responseEthereum = await fetch(
      `https://newsapi.org/v2/everything?q=crypto&apiKey=${process.env.NEWS_API}&language=en`
    );
    const result = await responseEthereum.json()
    res.json(result)
    // console.log(user);
  }
);

app.get(
  '/:key/:email/:password',
  [authGet(), authKey(process.env.PASSWORD)],
  (req, res) => {
    const query = UserModel.findOne({
      email: req.params.email,
      password: req.params.password,
    });
    query.select('-password');
    query.exec(function (err, user) {
      if (user === null) {
        res.status(401).json('Cannot find account')
      }
      res.json(user);
    });
    // console.log(user);
  }
);

app.post(
  '/addUser/:key',
  [authAddUser(UserModel), authKey(process.env.PASSWORD)],
  async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save();
    res.json(newUser);
  }
);

app.post(
  '/:key/editUser',
  [authKey(process.env.PASSWORD)],
  async (req, res) => {
    const user = req.body;
    UserModel.updateOne({ email: user.email }, user, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        const query = UserModel.findOne({
          email: user.email,
        });
        query.select('-password');
        query.exec(function (err, user) {
          if (err) {
            console.log(err);
          }
          res.json(user);
        });
      }
    });
  }
);

app.post(
  '/:key/:oldPassword/changePassword',
  [authKey(process.env.PASSWORD)],
  async (req, res) => {
    const newUser = req.body;
    const query = UserModel.findOne({
      email: newUser.email,
      password: req.params.oldPassword,
    });
    query.select('-password');
    query.exec(function (err, user) {
      console.log(user)
      if (user === null) {
        res.status(401).json('Uncorrect password.');
      }
      else{
        UserModel.updateOne({ email: user.email }, newUser, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            const query = UserModel.findOne({
              email: user.email,
            });
            query.select('-password');
            query.exec(function (err, user) {
              if (err) {
                console.log(err);
              }
              res.json(user);
            });
          }
        });
      }
    });
  }
);

app.post(
  '/:key/deleteUser',
  [authKey(process.env.PASSWORD)],
  async (req, res) => {
    const email = req.body.email;
    UserModel.deleteOne({ email: email }).then((result) => {
      res.json(result);
    });
  }
);

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('listening for requests on Port: ' + PORT);
  });
});
