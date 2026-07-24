const mongoose = require('mongoose');
const { DealStatus, DealType } = require('../constants/enums');

const dealSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    dealPrice: {
      type: Number,
      required: [true, 'Deal price is required'],
      min: [0, 'Deal price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Original price cannot be negative'],
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: 0,
      max: 100,
    },
    couponDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    bankOffer: {
      type: String,
      trim: true,
      default: '',
    },
    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    dealScore: {
      type: Number,
      default: 0,
      index: true,
    },
    dealType: {
      type: String,
      enum: Object.values(DealType),
      default: DealType.PRICE_DROP,
    },
    status: {
      type: String,
      enum: Object.values(DealStatus),
      default: DealStatus.PENDING,
      index: true,
    },
    expiryTime: {
      type: Date,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    telegramPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TelegramPost',
      default: null,
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

// Compound indexes for deal discovery queries
dealSchema.index({ status: 1, dealScore: -1 });
dealSchema.index({ product: 1, status: 1 });

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
