const mongoose = require('mongoose');

const monitoringConfigurationSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    merchant: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    priority: {
      type: Number,
      default: 40,
      index: true,
    },
    interval: {
      type: Number,
      default: 3600, // interval in seconds
    },
    retryPolicy: {
      type: Object,
      default: { maxRetries: 3, backoffFactor: 2 },
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    timeout: {
      type: Number,
      default: 30000,
    },
    lastRun: {
      type: Date,
      default: null,
    },
    nextRun: {
      type: Date,
      default: Date.now,
      index: true,
    },
    strategy: {
      type: String,
      default: 'static',
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for queue picking
monitoringConfigurationSchema.index({ enabled: 1, nextRun: 1, priority: -1 });

module.exports = mongoose.model('MonitoringConfiguration', monitoringConfigurationSchema);
