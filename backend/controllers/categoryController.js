import Category from '../models/Category.js';
import Product from '../models/Product.js';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category by slug or ID
 * @route   GET /api/categories/:idOrSlug
 * @access  Public
 */
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const query = req.params.idOrSlug;
    let category;

    if (query.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(query);
    } else {
      category = await Category.findOne({ slug: query.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Department category '${query}' not found.`,
      });
    }

    const productsCount = await Product.countDocuments({ category: category.slug });

    res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        productsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create category (Admin)
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res, next) => {
  try {
    const { slug, name, subtitle, indexLabel, image, featured } = req.body;

    const exists = await Category.findOne({ slug: slug.toLowerCase() });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'A category with this slug already exists.',
      });
    }

    const category = await Category.create({
      slug: slug.toLowerCase(),
      name,
      subtitle,
      indexLabel,
      image,
      featured: featured !== undefined ? featured : true,
    });

    res.status(201).json({
      success: true,
      message: 'Department category created successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category (Admin)
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category (Admin)
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
