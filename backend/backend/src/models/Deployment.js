const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema(
  {
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    pipelineId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'running', 'failed'],
      default: 'running',
    },
    version: {
      type: String,
      required: true,
    },
    commitHash: {
      type: String,
    },
    environment: {
      type: String,
      enum: ['dev', 'staging', 'production'],
      default: 'dev',
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deployment', deploymentSchema);
