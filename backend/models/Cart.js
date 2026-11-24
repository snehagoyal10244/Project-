import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
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
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  selectedColor: {
    type: String,
    default: 'Default',
  },
  colorHex: {
    type: String,
    default: '#9e8f7d',
  },
  selectedSize: {
    type: String,
    default: 'Standard',
  },
  image: {
    type: String,
  },
  categoryLabel: {
    type: String,
    default: 'Atelier Collection',
  },
  origin: {
    type: String,
    default: 'European Atelier',
  },
  badge: {
    type: String,
    default: 'Curated',
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    promoCode: {
      type: String,
      default: '',
      uppercase: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual calculation for cart totals
cartSchema.virtual('totals').get(function () {
  const rawSubtotal = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountAmount = Math.round((rawSubtotal * (this.discountPercent || 0)) / 100);
  const subtotal = rawSubtotal - discountAmount;
  const isFreeShipping = rawSubtotal >= 150 || this.items.length === 0;
  const shippingCost = isFreeShipping ? 0 : 25;
  const total = subtotal + shippingCost;
  const cartCount = this.items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cartCount,
    rawSubtotal,
    discountAmount,
    subtotal,
    isFreeShipping,
    freeShippingThreshold: 150,
    shippingCost,
    total,
  };
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
