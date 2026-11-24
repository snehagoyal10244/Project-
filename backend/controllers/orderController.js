import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

/**
 * Generate unique order reference (e.g. NVR-98421-E)
 */
const generateOrderNumber = () => {
  const digits = Math.floor(10000 + Math.random() * 90000);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const suffix = chars[Math.floor(Math.random() * chars.length)];
  return `NVR-${digits}-${suffix}`;
};

/**
 * @desc    Place a new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'cod',
      paymentDetails,
      customerInfo,
      promoCode,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified in order request.',
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid shipping address.',
      });
    }

    // Server-side validation of prices and stock
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of orderItems) {
      let product;
      if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(item.productId);
      }
      if (!product && item.productId) {
        product = await Product.findOne({ slug: item.productId.toLowerCase() });
      }

      const price = product ? product.price : (item.price || 100);
      const name = product ? product.name : (item.name || 'Atelier Item');
      const image = product ? (product.coverImage || product.images?.[0]) : (item.image || '');

      // Check stock
      if (product) {
        if (product.stockCount < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stockCount}`,
          });
        }
        // Safely decrement stock
        product.stockCount -= item.quantity;
        product.inStock = product.stockCount > 0;
        await product.save();
      }

      subtotal += price * item.quantity;

      verifiedItems.push({
        product: product?._id,
        productId: item.productId,
        name,
        price,
        quantity: item.quantity,
        selectedColor: item.selectedColor || 'Default',
        selectedSize: item.selectedSize || 'Standard',
        image,
      });
    }

    // Discounts
    let discountPercent = 0;
    const cleanPromo = (promoCode || '').toUpperCase().trim();
    if (cleanPromo === 'NOVARA20') discountPercent = 20;
    if (cleanPromo === 'NOVARA35') discountPercent = 35;
    if (cleanPromo === 'NOVARA15') discountPercent = 15;

    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const shippingCost = subtotal >= 150 ? 0 : 25;
    const total = subtotal - discountAmount + shippingCost;

    const orderNumber = generateOrderNumber();

    // Initial timeline
    const statusTimeline = [
      {
        status: 'Confirmed',
        title: 'Order Confirmed',
        description: 'Payment verified & tokenized via PCI-DSS Vault.',
        timestamp: new Date(),
        completed: true,
      },
      {
        status: 'Processing',
        title: 'Artisanal Packaging',
        description: 'Hand-inspection & mulberry tissue layering in Milan Atelier hub.',
        timestamp: new Date(Date.now() + 60 * 1000),
        completed: true,
      },
      {
        status: 'Shipped',
        title: 'Global Express Transit',
        description: 'Departing Malpensa Airport (MXP) direct courier.',
        timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
        completed: false,
      },
      {
        status: 'Delivered',
        title: 'Doorstep Delivery',
        description: 'White glove courier delivery with signature confirmation.',
        timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        completed: false,
      },
    ];

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      customerInfo: {
        name: customerInfo?.name || req.user.name,
        email: customerInfo?.email || req.user.email,
        phone: customerInfo?.phone || req.user.phone,
      },
      shippingAddress,
      orderItems: verifiedItems,
      pricing: {
        subtotal,
        discountAmount,
        shippingCost,
        total,
        promoCode: cleanPromo,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'authorized' : 'paid',
      paymentDetails: paymentDetails || {},
      orderStatus: 'Confirmed',
      statusTimeline,
    });

    // Clear user cart upon successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], promoCode: '', discountPercent: 0 });

    res.status(201).json({
      success: true,
      message: 'Order placed and confirmed successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user's order history
 * @route   GET /api/orders
 * @access  Private
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID or orderNumber
 * @route   GET /api/orders/:idOrOrderNumber
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const query = req.params.idOrOrderNumber;
    let order;

    if (query.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(query);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: query.toUpperCase() });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order dossier not found.' });
    }

    // Verify ownership or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to view this order.',
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Public Track order status
 * @route   GET /api/orders/track/:code
 * @access  Public
 */
export const trackOrder = async (req, res, next) => {
  try {
    const code = req.params.code.trim().toUpperCase();

    const order = await Order.findOne({
      $or: [{ orderNumber: code }, { trackingCode: code }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No active fulfillment dossier found for tracking code '${code}'.`,
      });
    }

    res.status(200).json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        trackingCode: order.trackingCode,
        orderStatus: order.orderStatus,
        statusTimeline: order.statusTimeline,
        deliveryCourier: order.deliveryCourier,
        customerInfo: {
          name: order.customerInfo.name,
        },
        shippingAddress: {
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          country: order.shippingAddress.country,
        },
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an order (if eligible: Pending or Confirmed)
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Verify ownership
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Confirmed') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already '${order.orderStatus}'. Please contact Customer Concierge.`,
      });
    }

    // Restore stock
    for (const item of order.orderItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockCount: item.quantity },
          inStock: true,
        });
      }
    }

    order.orderStatus = 'Cancelled';
    order.statusTimeline.push({
      status: 'Cancelled',
      title: 'Order Cancelled',
      description: 'Order cancelled by customer. Stock restored to archive.',
      timestamp: new Date(),
      completed: true,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully. Refund initiated if prepaid.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.orderStatus = status;

    order.statusTimeline.push({
      status,
      title: `Status: ${status}`,
      description: note || `Order status updated to ${status} by Atelier Dispatch Operations.`,
      timestamp: new Date(),
      completed: true,
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'.`,
      order,
    });
  } catch (error) {
    next(error);
  }
};
