const mongoose = require('mongoose');
const { MerchantStatus } = require('../constants/enums');

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Merchant name is required'],
      trim: true,
      maxlength: [100, 'Merchant name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Merchant slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      required: [true, 'Merchant website URL is required'],
      trim: true,
    },
    affiliateSupported: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(MerchantStatus),
        message: 'Status must be either ACTIVE or INACTIVE',
      },
      default: MerchantStatus.ACTIVE,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
