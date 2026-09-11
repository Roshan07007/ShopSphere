import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

// Helper to generate slug from name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const queryObj = {};

    // Text search (keyword / search)
    const keyword = req.query.search || req.query.keyword;
    if (keyword) {
      queryObj.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    // Category filter (accepts category slug or ObjectId)
    if (req.query.category && req.query.category !== 'all') {
      let categoryId = req.query.category;
      if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        const foundCat = await Category.findOne({ slug: req.query.category });
        if (foundCat) {
          categoryId = foundCat._id;
        }
      }
      queryObj.category = categoryId;
    }

    // Brand filter (can be comma-separated or single)
    if (req.query.brand) {
      const brands = req.query.brand.split(',').map((b) => b.trim());
      queryObj.brand = { $in: brands.map((b) => new RegExp(`^${b}$`, 'i')) };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.rating) {
      queryObj.rating = { $gte: Number(req.query.rating) };
    }

    // In-stock filter
    if (req.query.inStock === 'true') {
      queryObj.stock = { $gt: 0 };
    }

    // Flags
    if (req.query.isFeatured === 'true') queryObj.isFeatured = true;
    if (req.query.isTrending === 'true') queryObj.isTrending = true;
    if (req.query.isBestSeller === 'true') queryObj.isBestSeller = true;
    if (req.query.isNewArrival === 'true') queryObj.isNewArrival = true;

    // Sorting
    let sortQuery = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortQuery = { price: 1 };
          break;
        case 'price_desc':
          sortQuery = { price: -1 };
          break;
        case 'rating':
          sortQuery = { rating: -1, numReviews: -1 };
          break;
        case 'popular':
          sortQuery = { numReviews: -1, rating: -1 };
          break;
        case 'newest':
        default:
          sortQuery = { createdAt: -1 };
          break;
      }
    }

    const total = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .populate('category', 'name slug')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit) || 1,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get fast autocomplete search suggestions
// @route   GET /api/products/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, suggestions: [] });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q.trim(), $options: 'i' } },
        { brand: { $regex: q.trim(), $options: 'i' } }
      ]
    })
      .select('name slug price discountPrice images category brand')
      .populate('category', 'name slug')
      .limit(6);

    res.json({ success: true, suggestions: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by Slug or ID with related items
// @route   GET /api/products/:identifier
// @access  Public
export const getProductByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let query;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier };
    }

    const product = await Product.findOne(query).populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch up to 4 related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id }
    })
      .limit(4)
      .populate('category', 'name slug');

    res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get special showcase product groups (Featured, Trending, Best Sellers, New Arrivals)
// @route   GET /api/products/collections/showcase
// @access  Public
export const getShowcaseProducts = async (req, res) => {
  try {
    const [featured, trending, bestSellers, newArrivals] = await Promise.all([
      Product.find({ isFeatured: true }).populate('category', 'name slug').limit(8),
      Product.find({ isTrending: true }).populate('category', 'name slug').limit(8),
      Product.find({ isBestSeller: true }).populate('category', 'name slug').limit(8),
      Product.find({ isNewArrival: true }).populate('category', 'name slug').sort({ createdAt: -1 }).limit(8)
    ]);

    res.json({
      success: true,
      featured,
      trending,
      bestSellers,
      newArrivals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all distinct brands
// @route   GET /api/products/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json({ success: true, brands: brands.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      brand,
      stock,
      isFeatured,
      isTrending,
      isBestSeller,
      isNewArrival,
      tags,
      specs,
      colors,
      sizes
    } = req.body;

    let baseSlug = slugify(name);
    let slug = baseSlug;
    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const product = new Product({
      name,
      slug,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      images: Array.isArray(images) ? images : [images],
      category,
      brand,
      stock: Number(stock) || 0,
      isFeatured: !!isFeatured,
      isTrending: !!isTrending,
      isBestSeller: !!isBestSeller,
      isNewArrival: !!isNewArrival,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      specs: specs || [],
      colors: colors || [],
      sizes: sizes || []
    });

    const createdProduct = await product.save();

    // Increment category itemCount
    await Category.findByIdAndUpdate(category, { $inc: { itemCount: 1 } });

    res.status(201).json({
      success: true,
      product: createdProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const oldCategory = product.category;

    product.name = req.body.name || product.name;
    if (req.body.name && req.body.name !== product.name) {
      product.slug = slugify(req.body.name);
    }
    product.description = req.body.description || product.description;
    product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.discountPrice = req.body.discountPrice !== undefined ? (req.body.discountPrice ? Number(req.body.discountPrice) : null) : product.discountPrice;
    if (req.body.images) product.images = req.body.images;
    if (req.body.category) product.category = req.body.category;
    if (req.body.brand) product.brand = req.body.brand;
    if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
    if (req.body.isFeatured !== undefined) product.isFeatured = req.body.isFeatured;
    if (req.body.isTrending !== undefined) product.isTrending = req.body.isTrending;
    if (req.body.isBestSeller !== undefined) product.isBestSeller = req.body.isBestSeller;
    if (req.body.isNewArrival !== undefined) product.isNewArrival = req.body.isNewArrival;
    if (req.body.tags) product.tags = req.body.tags;
    if (req.body.specs) product.specs = req.body.specs;
    if (req.body.colors) product.colors = req.body.colors;
    if (req.body.sizes) product.sizes = req.body.sizes;

    const updatedProduct = await product.save();

    // If category changed, update counters
    if (req.body.category && req.body.category.toString() !== oldCategory.toString()) {
      await Category.findByIdAndUpdate(oldCategory, { $inc: { itemCount: -1 } });
      await Category.findByIdAndUpdate(req.body.category, { $inc: { itemCount: 1 } });
    }

    res.json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const catId = product.category;
    await product.deleteOne();

    // Decrement category counter & delete associated reviews
    if (catId) {
      await Category.findByIdAndUpdate(catId, { $inc: { itemCount: -1 } });
    }
    await Review.deleteMany({ product: req.params.id });

    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: req.params.id,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: req.params.id,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating: Number(rating),
      title: title || '',
      comment
    });

    // Recompute product rating average & numReviews
    const reviews = await Review.find({ product: req.params.id });
    product.numReviews = reviews.length;
    product.rating = Number(
      (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
    );

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
