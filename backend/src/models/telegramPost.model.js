const mongoose = require('mongoose');

const telegramPostSchema = new mongoose.Schema(
  {
    telegramMessageId: {
      type: Number,
      required: [true, 'Telegram Message ID is required'],
    },
    channelId: {
      type: String,
      required: [true, 'Telegram Channel ID is required'],
      trim: true,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      required: [true, 'Deal reference is required'],
      index: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
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

// Unique constraint to prevent duplicate post tracking
telegramPostSchema.index({ telegramMessageId: 1, channelId: 1 }, { unique: true });

const TelegramPost = mongoose.model('TelegramPost', telegramPostSchema);

module.exports = TelegramPost;
