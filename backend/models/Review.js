import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    userAvatar: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1-5)'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate review by same user on same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to recalculate average rating & review count for product
reviewSchema.statics.getAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewsCount: stats[0].reviewsCount,
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      rating: 5.0,
      reviewsCount: 0,
    });
  }
};

// Post-save and post-delete hooks to recalculate ratings
reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.product);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.product);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
