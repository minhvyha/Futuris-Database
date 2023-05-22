const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  assets: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  email:{
    type: String,
    require: true
  },
  cash: {
    type: Number,
    default: 0,
  },
  totalAssets: {
    type: Number,
    default: 0,
  },
  dob:{
    type: String,
    default: "01/01/2000"
  },
  password: {
    type: String,
    require: true
  }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = {UserModel};
