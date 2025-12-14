const mongoose = require('mongoose');

const costSchema = new mongoose.Schema(
  {
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    service: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    region: {
      type: String,
      default: 'us-east-1',
    },
    details: {
      instances: Number,
      storage: Number,
      bandwidth: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cost', costSchema);
