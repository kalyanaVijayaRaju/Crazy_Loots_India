const mongoose = require('mongoose');
const { ScrapeJobStatus } = require('../constants/enums');

const scrapeJobSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: [true, 'Merchant reference is required'],
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    finishedAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: 0, // Duration in milliseconds
    },
    status: {
      type: String,
      enum: Object.values(ScrapeJobStatus),
      default: ScrapeJobStatus.PENDING,
      index: true,
    },
    totalProducts: {
      type: Number,
      default: 0,
      min: 0,
    },
    successCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    errorMessage: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

scrapeJobSchema.index({ merchant: 1, startedAt: -1 });
scrapeJobSchema.index({ status: 1, startedAt: -1 });

const ScrapeJob = mongoose.model('ScrapeJob', scrapeJobSchema);

module.exports = ScrapeJob;
