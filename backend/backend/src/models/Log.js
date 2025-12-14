const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    serverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Server',
    },
    type: {
      type: String,
      enum: ['application', 'security', 'audit'],
      default: 'application',
    },
    severity: {
      type: String,
      enum: ['critical', 'error', 'warning', 'info'],
      default: 'info',
    },
    message: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
