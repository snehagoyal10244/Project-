import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category slug is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    categoryLabel: {
      type: String,
      trim: true,
      default: 'Atelier Collection',
    },
    brand: {
      type: String,
      default: 'NOVARA',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be positive'],
      default: function () {
        return this.price;
      },
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      default: 10,
      min: [0, 'Stock count cannot be negative'],
    },
    origin: {
      type: String,
      default: 'European Atelier',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    details: [
      {
        type: String,
        trim: true,
      },
    ],
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        inStock: { type: Boolean, default: true },
      },
    ],
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    defaultSize: {
      type: String,
      default: 'M',
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    coverImage: {
      type: String,
      default: function () {
        return this.images && this.images[0] ? this.images[0] : '';
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

// Auto-calculate discountPercent if originalPrice > price
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercent = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  if (!this.shortName) {
    this.shortName = this.name;
  }
  if (!this.coverImage && this.images && this.images.length > 0) {
    this.coverImage = this.images[0];
  }
  this.inStock = this.stockCount > 0;
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
