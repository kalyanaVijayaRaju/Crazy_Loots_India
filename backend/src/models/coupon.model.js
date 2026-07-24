const mongoose = require('mongoose');
const { CouponStatus } = require('../constants/enums');

const couponSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: [true, 'Merchant reference is required'],
      index: true,
    },
    couponCode: {
      type: String,
      required: [true, 'Coupon code is required'],
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Coupon description is required'],
      trim: true,
    },
    discount: {
      type: String,
      trim: true,
      default: '',
    },
    minimumOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(CouponStatus),
      default: CouponStatus.ACTIVE,
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

// Compound index for fast lookup per merchant
couponSchema.index({ merchant: 1, couponCode: 1 });
couponSchema.index({ status: 1, expiryDate: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
