const mongoose = require('mongoose');
const { ProductStatus, Currency, Availability } = require('../constants/enums');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: [true, 'Merchant reference is required'],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
      index: true,
    },
    productId: {
      type: String,
      required: [true, 'Merchant Product ID is required'],
      trim: true,
    },
    productUrl: {
      type: String,
      required: [true, 'Product URL is required'],
      trim: true,
    },
    affiliateUrl: {
      type: String,
      trim: true,
      default: '',
    },
    brand: {
      type: String,
      trim: true,
      default: 'Generic',
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true,
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.INR,
    },
    availability: {
      type: String,
      enum: Object.values(Availability),
      default: Availability.IN_STOCK,
      index: true,
    },
    trackingEnabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastCheckedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.ACTIVE,
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

// Compound index to guarantee uniqueness of product per merchant
productSchema.index({ merchant: 1, productId: 1 }, { unique: true });
productSchema.index({ trackingEnabled: 1, lastCheckedAt: 1 });
productSchema.index({ status: 1, discountPercentage: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
