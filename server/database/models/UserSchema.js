const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  attendance: [
    {
      title: {
        type: String,
        enum: ['present', 'absent'],
        required: true,
        default: 'absent'
      },
      date: {
        type: Date,
        required: true
      }
    }
  ],
  registerDate: {
    type: Date,
    default: Date.now
  }
}, { minimize: false });

const User = new mongoose.model("User", UserSchema);
module.exports = User