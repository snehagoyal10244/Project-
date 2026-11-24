import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    indexLabel: {
      type: String,
      trim: true,
      default: '',
    },
    itemCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Category image URL is required'],
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
