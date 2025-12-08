const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema(
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
    hostname: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['running', 'stopped', 'maintenance'],
      default: 'running',
    },
    region: {
      type: String,
      default: 'us-east-1',
    },
    cpu: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
    disk: {
      type: Number,
      default: 0,
    },
    network: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Server', serverSchema);
