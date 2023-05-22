const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  assets: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      "AAPL" : 50000
    }
  },
  email:{
    type: String,
    require: true
  },
  cash: {
    type: Number,
    default: 100000,
  },
  totalAssets: {
    type: Number,
    default: 150000,
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
