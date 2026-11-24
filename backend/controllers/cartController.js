import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Helper to get or create cart for user
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

/**
 * @desc    Get current user's shopping bag
 * @route   GET /api/cart
 * @access  Private
 */
export const getUserCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json({
      success: true,
      cart: {
        id: cart._id,
        items: cart.items,
        promoCode: cart.promoCode,
        discountPercent: cart.discountPercent,
        ...cart.totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to shopping bag
 * @route   POST /api/cart
 * @access  Private
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID or Slug is required to add to bag.',
      });
    }

    // Find product by id or slug
    let product;
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({ slug: productId.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in the atelier catalog.',
      });
    }

    // Check stock
    if (product.stockCount < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockCount} units remaining in stock.`,
      });
    }

    const cart = await getOrCreateCart(req.user._id);

    const color = selectedColor || (product.colors?.[0]?.name) || 'Default';
    const colorHex = (product.colors?.find(c => c.name === color)?.hex) || '#9e8f7d';
    const size = selectedSize || product.defaultSize || (product.sizes?.[0]) || 'Standard';

    // Check if item with same productId, color, size exists
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId === (product.slug || product._id.toString()) &&
        item.selectedColor === color &&
        item.selectedSize === size
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        productId: product.slug || product._id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        quantity: Number(quantity),
        selectedColor: color,
        colorHex: colorHex,
        selectedSize: size,
        image: product.coverImage || product.images?.[0] || '',
        categoryLabel: product.categoryLabel,
        origin: product.origin,
        badge: product.subtitle ? product.subtitle.split(' ')[0] : 'Curated',
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: `Added "${product.shortName || product.name}" to your atelier bag.`,
      cart: {
        id: cart._id,
        items: cart.items,
        promoCode: cart.promoCode,
        discountPercent: cart.discountPercent,
        ...cart.totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quantity of item in bag
 * @route   PUT /api/cart/item/:itemId
 * @access  Private
 */
export const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await getOrCreateCart(req.user._id);

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in bag.' });
    }

    if (Number(quantity) <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Validate stock
      const product = await Product.findById(cart.items[itemIndex].product);
      if (product && product.stockCount < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockCount} units remaining in stock.`,
        });
      }
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart: {
        id: cart._id,
        items: cart.items,
        promoCode: cart.promoCode,
        discountPercent: cart.discountPercent,
        ...cart.totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from bag
 * @route   DELETE /api/cart/item/:itemId
 * @access  Private
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from bag.',
      cart: {
        id: cart._id,
        items: cart.items,
        promoCode: cart.promoCode,
        discountPercent: cart.discountPercent,
        ...cart.totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear entire shopping bag
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.promoCode = '';
    cart.discountPercent = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Atelier bag cleared.',
      cart: {
        id: cart._id,
        items: [],
        promoCode: '',
        discountPercent: 0,
        ...cart.totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Apply promotional privilege code
 * @route   POST /api/cart/promo
 * @access  Private
 */
export const applyPromoCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a promotion code.' });
    }

    const cleanCode = code.trim().toUpperCase();
    let discountPercent = 0;

    if (cleanCode === 'NOVARA20') {
      discountPercent = 20;
    } else if (cleanCode === 'NOVARA35') {
      discountPercent = 35;
    } else if (cleanCode === 'NOVARA15') {
      discountPercent = 15;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid promotion code. Try 'NOVARA20' or 'NOVARA35'.",
      });
    }

    const cart = await getOrCreateCart(req.user._id);
    cart.promoCode = cleanCode;
    cart.discountPercent = discountPercent;
    await cart.save();

    res.status(200).json({
      success: true,
      message: `Privilege code '${cleanCode}' applied: ${discountPercent}% discount.`,
      cart: {
        id: cart._id,
        items: cart.items,
        promoCode: cart.promoCode,
        discountPercent: cart.discountPercent,
        ...cart.totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove promo code
 * @route   DELETE /api/cart/promo
 * @access  Private
 */
export const removePromoCode = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.promoCode = '';
    cart.discountPercent = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Promotion code removed.',
      cart: {
        id: cart._id,
        items: cart.items,
        promoCode: '',
        discountPercent: 0,
        ...cart.totals,
      },
    });
  } catch (error) {
    next(error);
  }
};
