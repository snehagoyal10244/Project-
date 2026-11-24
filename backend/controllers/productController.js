import Product from '../models/Product.js';

/**
 * @desc    Get all products with searching, filtering, and sorting
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      color,
      sort,
      filter,
      page = 1,
      limit = 40,
    } = req.query;

    const query = {};

    // Search query across name, shortName, subtitle, description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    // Special quick filter: new, bestseller, trending
    if (filter === 'new') {
      query.isNewArrival = true;
    } else if (filter === 'bestseller') {
      query.isBestSeller = true;
    } else if (filter === 'trending') {
      query.isTrending = true;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // In stock only
    if (inStock === 'true' || inStock === true) {
      query.inStock = true;
      query.stockCount = { $gt: 0 };
    }

    // Color shade filter
    if (color) {
      query['colors.name'] = { $regex: color, $options: 'i' };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'Price: Low to High' || sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'Price: High to Low' || sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'Customer Rating' || sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'Newest Drops' || sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID or Slug
 * @route   GET /api/products/:idOrSlug
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug;
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).populate('reviews');
    }

    if (!product) {
      product = await Product.findOne({ slug: idOrSlug.toLowerCase() }).populate('reviews');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product '${idOrSlug}' was not found in the atelier catalog.`,
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get trending products
 * @route   GET /api/products/filter/trending
 * @access  Public
 */
export const getTrendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(8);
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get best-selling products
 * @route   GET /api/products/filter/bestsellers
 * @access  Public
 */
export const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true }).limit(8);
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get new arrivals
 * @route   GET /api/products/filter/new-arrivals
 * @access  Public
 */
export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isNewArrival: true }).limit(8);
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create product (Admin)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product creation completed successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product (Admin)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product (Admin)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
