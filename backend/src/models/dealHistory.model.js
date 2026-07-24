const mongoose = require('mongoose');

const dealHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: [true, 'Merchant reference is required'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Deal price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: 0,
      max: 100,
    },
    dealScore: {
      type: Number,
      default: 0,
    },
    detectedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    reason: {
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

dealHistorySchema.index({ product: 1, detectedAt: -1 });
dealHistorySchema.index({ merchant: 1, published: 1 });

const DealHistory = mongoose.model('DealHistory', dealHistorySchema);

module.exports = DealHistory;
