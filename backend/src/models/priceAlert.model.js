const mongoose = require('mongoose');
const { PriceAlertStatus } = require('../constants/enums');

const priceAlertSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    targetPrice: {
      type: Number,
      required: [true, 'Target price is required'],
      min: [0, 'Target price cannot be negative'],
      index: true,
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
      min: [0, 'Current price cannot be negative'],
    },
    lastNotifiedPrice: {
      type: Number,
      default: null,
    },
    alertTriggered: {
      type: Boolean,
      default: false,
      index: true,
    },
    triggeredAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(PriceAlertStatus),
      default: PriceAlertStatus.ACTIVE,
      index: true,
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

priceAlertSchema.index({ product: 1, status: 1 });
priceAlertSchema.index({ status: 1, targetPrice: 1 });

const PriceAlert = mongoose.model('PriceAlert', priceAlertSchema);

module.exports = PriceAlert;
