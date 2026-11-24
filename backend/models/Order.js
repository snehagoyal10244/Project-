import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  selectedColor: {
    type: String,
    default: 'Default',
  },
  selectedSize: {
    type: String,
    default: 'Standard',
  },
  image: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'United States' },
    },
    orderItems: [orderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      shippingCost: { type: Number, default: 0 },
      total: { type: Number, required: true },
      promoCode: { type: String, default: '' },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'upi', 'card'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'authorized', 'paid', 'failed'],
      default: 'pending',
    },
    paymentDetails: {
      upiId: { type: String, default: '' },
      cardLast4: { type: String, default: '' },
      transactionId: { type: String, default: '' },
      gateway: { type: String, default: 'internal' }, // Prepared for razorpay
      paidAt: Date,
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Confirmed',
    },
    trackingCode: {
      type: String,
      default: function () {
        return `TRK-NV-${Math.floor(1000 + Math.random() * 9000)}-IT`;
      },
    },
    statusTimeline: [
      {
        status: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
        completed: { type: Boolean, default: false },
      },
    ],
    deliveryCourier: {
      provider: { type: String, default: 'DHL Global Luxury Express' },
      flightNumber: { type: String, default: 'DL-8842' },
      estimatedDelivery: {
        type: Date,
        default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
