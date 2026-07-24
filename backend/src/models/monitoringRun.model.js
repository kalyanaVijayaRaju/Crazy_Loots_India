const mongoose = require('mongoose');

const monitoringRunSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ['COMPLETED', 'FAILED', 'CANCELLED', 'RETRYING'],
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number,
      default: 0,
    },
    priceChanged: {
      type: Boolean,
      default: false,
      index: true,
    },
    changes: {
      type: Array,
      default: [],
    },
    error: {
      type: String,
      default: null,
    },
    metrics: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

monitoringRunSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model('MonitoringRun', monitoringRunSchema);
