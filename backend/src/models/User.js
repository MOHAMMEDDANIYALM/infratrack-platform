const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'DevOps', 'Viewer'],
      default: 'Viewer',
    },
    department: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'disabled', 'pending'],
      default: 'active',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
