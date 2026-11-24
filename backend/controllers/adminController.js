import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate revenue from paid or confirmed non-cancelled orders
    const revenueStats = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          averageOrderValue: { $avg: '$pricing.total' },
        },
      },
    ]);

    const totalRevenue = revenueStats[0]?.totalRevenue || 0;
    const averageOrderValue = Math.round((revenueStats[0]?.averageOrderValue || 0) * 100) / 100;

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('orderNumber customerInfo pricing orderStatus paymentMethod createdAt');

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        averageOrderValue,
        recentOrders,
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders with pagination & status filters (Admin)
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all customers with order stats (Admin)
 * @route   GET /api/admin/customers
 * @access  Private/Admin
 */
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .select('-password');

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    next(error);
  }
};
