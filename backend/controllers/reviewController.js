import Review from '../models/Review.js';
import Product from '../models/Product.js';

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let product;
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({ slug: productId.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: product.rating,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a product review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createProductReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, rating (1-5), and review comment are required.',
      });
    }

    let product;
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({ slug: productId.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an atelier reflection for this piece.',
      });
    }

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating: Number(rating),
      title: title || '',
      comment,
      verifiedPurchase: true,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your reflection. Your review has been archived.',
      review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review (Admin or Author)
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Review removed.' });
  } catch (error) {
    next(error);
  }
};
