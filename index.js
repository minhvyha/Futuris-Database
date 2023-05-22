require('dotenv').config();
const { authKey, authGet, authAddUser } = require('./middleware/middleware');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3011;
const { UserModel } = require('./models/UserModel');


app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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
  '/:key/:email/:password',
  [authGet(), authKey(process.env.PASSWORD)],
  (req, res) => {
    const query = UserModel.findOne({ email: req.params.email });
    query.select('');
    query.exec(function (err, user) {
      if (err) {
        console.log(err);
      }
      if (user.password === req.params.password){
        delete user.password
        res.json(user)
      }
      else{
        res.json(null);
      }
      console.log(user);
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
    res.json(user);
  }
);

app.post(
  '/editUser/:key',
  [authKey(process.env.PASSWORD)],
  async (req, res) => {
    const user = req.body;
    UserModel.updateOne({ email: user.email }, user, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }
);

app.post(
  '/deleteUser/:key',
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
