import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

/**
 * Helper to get or create wishlist
 */
const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [], productSlugs: [] });
  }
  return wishlist;
};

/**
 * @desc    Get current user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    await wishlist.populate('products');

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      productSlugs: wishlist.productSlugs,
      products: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle item in wishlist (add or remove)
 * @route   POST /api/wishlist/toggle
 * @access  Private
 */
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID or Slug is required.' });
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

    const wishlist = await getOrCreateWishlist(req.user._id);
    const slug = product.slug || product._id.toString();

    const existsIndex = wishlist.productSlugs.indexOf(slug);
    let isAdded = false;

    if (existsIndex > -1) {
      // Remove
      wishlist.productSlugs.splice(existsIndex, 1);
      wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== product._id.toString()
      );
    } else {
      // Add
      wishlist.productSlugs.push(slug);
      wishlist.products.push(product._id);
      isAdded = true;
    }

    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({
      success: true,
      isAdded,
      message: isAdded
        ? `Saved "${product.shortName || product.name}" to your wishlist.`
        : `Removed "${product.shortName || product.name}" from your wishlist.`,
      count: wishlist.products.length,
      productSlugs: wishlist.productSlugs,
      products: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const wishlist = await getOrCreateWishlist(req.user._id);

    wishlist.productSlugs = wishlist.productSlugs.filter((s) => s !== productId);
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      count: wishlist.products.length,
      productSlugs: wishlist.productSlugs,
      products: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Move item from wishlist to cart
 * @route   POST /api/wishlist/move-to-cart
 * @access  Private
 */
export const moveWishlistToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

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

    // Add to cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    cart.items.push({
      product: product._id,
      productId: product.slug || product._id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      selectedColor: product.colors?.[0]?.name || 'Default',
      colorHex: product.colors?.[0]?.hex || '#9e8f7d',
      selectedSize: product.defaultSize || 'M',
      image: product.coverImage || product.images?.[0] || '',
      categoryLabel: product.categoryLabel,
      origin: product.origin,
    });
    await cart.save();

    // Remove from wishlist
    const wishlist = await getOrCreateWishlist(req.user._id);
    const slug = product.slug || product._id.toString();
    wishlist.productSlugs = wishlist.productSlugs.filter((s) => s !== slug);
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== product._id.toString()
    );
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: `Moved "${product.shortName || product.name}" to your atelier bag.`,
    });
  } catch (error) {
    next(error);
  }
};
