const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "Admin"],
    default: "user"
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  phone: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  },
  messages: {
    type: [{
      message:
      {
        type: String,
        required: true
      },
      read:
      {
        type: Boolean,
        default: false
      },
      createdAt:
      {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  }
}, { timestamps: true });

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
}

userSchema.methods.countUnreadMessages = function () {
  return this.messages.filter(message => !message.read).length;
}

userSchema.methods.markAllMessagesAsRead = function () {
  this.messages.forEach(message => {
    message.read = true;
  });
  return this.save();
}

const User = mongoose.model('User', userSchema);

module.exports = User;