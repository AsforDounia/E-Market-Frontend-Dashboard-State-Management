import { Product, Category } from "../models/Index.js";
import mongoose from "mongoose";
import { AppError } from "../middlewares/errorHandler.js";
import notificationService from "../services/notificationService.js";
import cacheInvalidation from "../services/cacheInvalidation.js";
import Review from "../models/Review.js"; // Import the Review model
import { getReviewsForProduct } from "../services/reviewService.js";
const ObjectId = mongoose.Types.ObjectId;

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}


async function getAllProducts(req, res, next) {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      order,
      page = 1,
      limit = 8,
      seller,
      validationStatus, // Added validationStatus
    } = req.query;

    // Base filter
    const filter = {
      deletedAt: null,
    };

    // Add validationStatus to filter if provided and valid
    if (validationStatus && ['pending', 'approved', 'rejected'].includes(validationStatus)) {
      filter.validationStatus = validationStatus;
    }

    console.log("Filter being used for products:", filter); // Debugging line

    // Seller filter
    if (seller) filter.sellerId = seller;

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }

    // Stock filter
    if (inStock === "true") filter.stock = { $gt: 0 };

    // Category filter
    if (category) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(category);
      const categoryDoc = isValidObjectId
        ? await Category.findById(category)
        : await Category.findOne({ name: { $regex: category, $options: "i" } });

      if (categoryDoc) {
        filter.categories = categoryDoc._id;
      }
    }

    // Sorting logic
    const sortOptions = {};
    const sortByRating = sortBy === "rating";
    if (!sortByRating) {
      switch (sortBy) {
        case "price":
          sortOptions.price = order === "asc" ? 1 : -1;
          break;
        case "date":
          sortOptions.createdAt = order === "asc" ? 1 : -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    }

    // Pagination setup
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch products (without pagination if sorting by rating)
    const filteredProducts = sortByRating
      ? await Product.find(filter).populate("sellerId", "fullname email").populate("categories").sort({ createdAt: -1 })
      : await Product.find(filter)
        .populate("sellerId", "fullname email")
        .populate("categories")
        .select('-_v')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

    console.log("Products found in DB:", filteredProducts); // Debugging line

    // Build final enriched result
    let finalResults = await Promise.all(
      filteredProducts.map(async (product) => {
        const reviewData = await getReviewsForProduct(product._id);

        return {
          _id: product._id,
          slug: product.slug,
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          sellerId: product.sellerId,
          imageUrls: product.imageUrls,
          validationStatus: product.validationStatus,
          isVisible: product.isVisible,
          isAvailable: product.isAvailable,
          createdAt: product.createdAt,
          categoryIds: product.categories,
          rating: {
            average: reviewData.averageRating,
            count: reviewData.count,
          },
          reviews: reviewData.reviews,
        };
      })
    );

    // Sort by rating if needed
    if (sortByRating) {
      finalResults.sort((a, b) => {
        const diff = b.rating.average - a.rating.average;
        return order === "asc" ? -diff : diff;
      });
      finalResults = finalResults.slice(skip, skip + Number(limit));
    }

    // Total count for pagination metadata
    const totalProducts = await Product.countDocuments(filter);

    // Final Response
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      metadata: {
        total: totalProducts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / Number(limit)),
        pageSize: Number(limit),
        hasNextPage: Number(page) < Math.ceil(totalProducts / Number(limit)),
        hasPreviousPage: Number(page) > 1,
      },
      data: {
        products: finalResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product ID", 400);
    }

    // Find product
    const product = await Product.findById(id).where({ deletedAt: null }).populate("categories");
    if (!product) throw new AppError("Product not found", 404);

    // Parallel queries for related data
    const reviewData = await getReviewsForProduct(product._id);

    // Build final response object
    const productData = {
      _id: product._id,
      slug: product.slug,
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      imageUrls: product.imageUrls,
      categories: product.categories,
      validationStatus: product.validationStatus,
      isVisible: product.isVisible,
      isAvailable: product.isAvailable,
      rating: {
        average: reviewData.averageRating,
        count: reviewData.count,
      },
      reviews: reviewData.reviews,
    };

    // Send JSON response
    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: {
        product: productData,
      },
    });
  } catch (error) {
    next(error);
  }
}




async function createProduct(req, res, next) {
  try {
    const sellerId = req.user?._id;
    let { title, description, price, stock, categoryIds } = req.body;
    console.log(req.body);

    // ======== PARSE CATEGORYIDS IF STRING ========

    if (typeof categoryIds === "string") {
      try {
        categoryIds = JSON.parse(categoryIds);
      } catch (e) {
        throw new AppError("Invalid categoryIds format", 400);
      }
    }

    // Handle case where categoryIds is an array with a single string element
    if (
      Array.isArray(categoryIds) &&
      categoryIds.length === 1 &&
      typeof categoryIds[0] === "string"
    ) {
      try {
        categoryIds = JSON.parse(categoryIds[0]);
      } catch (e) {
        throw new AppError("Invalid categoryIds format", 400);
      }
    }

    // ======== VALIDATIONS ========
    if (!sellerId) throw new AppError("Seller information is required", 400);
    if (!title || !description || price == null || stock == null || !categoryIds)
      throw new AppError("Title, description, price, stock and categories are required", 400);
    if (!Array.isArray(categoryIds)) throw new AppError("categoryIds must be an array", 400);
    if (categoryIds.length === 0) throw new AppError("At least one category is required", 400);
    if (categoryIds.some((id) => !ObjectId.isValid(id)))
      throw new AppError("Invalid category ID", 400);

    // Generate unique slug
    let slug = generateSlug(title);
    let slugExists = await Product.findOne({ slug });
    let counter = 1;

    // If slug exists, append number until we find unique slug
    while (slugExists) {
      slug = `${generateSlug(title)}-${counter}`;
      slugExists = await Product.findOne({ slug });
      counter++;
    }
    // ======== CREATE PRODUCT ========
    // ======== CREATE PRODUCT ========
    const product = await Product.create({
      slug,
      title,
      description,
      price,
      stock,
      sellerId,
      categories: categoryIds,
    });

    // ======== ADD CATEGORIES ========
    // Removed ProductCategory creation as categories are now embedded

    // ======== HANDLE IMAGES ========
    if (req.files && req.files.length > 0) {
      product.imageUrls = req.files.map(file => `/uploads/products/optimized/${file.filename}`);
      await product.save();
    }

    // ======== CLEAR CACHE ========
    await cacheInvalidation.invalidateProducts();

    // ======== RESPONSE ========
    res.status(201).json({
      success: true,
      message: "Product created successfully (awaiting admin validation)",
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) throw new AppError("Invalid product ID", 400);
    const { title, description, price, stock, imageUrls, categoryIds } = req.body;

    if (categoryIds && !Array.isArray(categoryIds))
      throw new AppError("categoryIds must be an array", 400);
    if (categoryIds && categoryIds.some((categoryId) => !ObjectId.isValid(categoryId)))
      throw new AppError("Invalid category ID", 400);

    const product = await Product.findById(id);

    if (!product) throw new AppError("Product not found", 404);
    if (product.deletedAt) throw new AppError("Cannot update a deleted product", 400);

    if (req.user.role === "seller" && product.sellerId.toString() !== req.user._id.toString()) {
      throw new AppError("You are not authorized to update this product", 403);
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (price != null) product.price = price;
    if (stock != null) product.stock = stock;
    if (imageUrls) product.imageUrls = imageUrls;
    if (categoryIds) product.categories = categoryIds;

    await product.save();
    // Invalidate products cache
    await cacheInvalidation.invalidateSpecificProduct(id);

    res.status(200).json({
      success: true,
      message: "Product updated",
      data: {
        product: product,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) throw new AppError("Invalid product ID", 400);
    const product = await Product.findById(id);

    if (!product) throw new AppError("Product not found", 404);
    if (product.deletedAt) throw new AppError("Product already deleted", 400);

    product.deletedAt = new Date();
    await product.save();
    // Invalidate products cache
    await cacheInvalidation.invalidateSpecificProduct(id);

    res.status(200).json({
      success: true,
      message: "Product soft-deleted",
      data: {
        product: product,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function updateProductVisibility(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) throw new AppError("Invalid product ID", 400);
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      throw new AppError("isVisible must be a boolean", 400);
    }

    const product = await Product.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!product) throw new AppError("Product not found", 404);

    if (req.user.role === "seller" && product.sellerId.toString() !== req.user._id.toString()) {
      throw new AppError("You are not authorized to update this product", 403);
    }

    product.isVisible = isVisible;
    await product.save();

    // Invalidate products cache
    await cacheInvalidation.invalidateSpecificProduct(id);

    res.json({
      success: true,
      message: `Product ${isVisible ? "shown" : "hidden"} successfully`,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getPendingProducts(req, res, next) {
  try {
    const products = await Product.find({
      validationStatus: "pending",
      deletedAt: null,
    }).populate("sellerId", "fullname email");

    res.json({
      success: true,
      message: "Pending products retrieved successfully",
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function validateProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) throw new AppError("Invalid product ID", 400);
    const product = await Product.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!product) throw new AppError("Product not found", 404);

    // Approve the product
    product.validationStatus = "approved";
    product.isVisible = true;
    product.isAvailable = true;
    product.validatedAt = new Date();

    await product.save();

    notificationService.emitPublishProduct({
      productId: product._id,
      title: product.title,
      sellerId: product.sellerId,
    });

    // Invalidate products cache
    await cacheInvalidation.invalidateProducts();

    res.json({
      success: true,
      message: "Product approved successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function rejectProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) throw new AppError("Invalid product ID", 400);
    const { reason } = req.body;

    const product = await Product.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!product) throw new AppError("Product not found", 404);

    // Reject the product
    product.validationStatus = "rejected";
    product.isVisible = false;
    product.isAvailable = false;
    product.rejectionReason = reason;
    product.validatedAt = new Date();

    await product.save();

    // Invalidate products cache
    await cacheInvalidation.invalidateProducts();

    res.json({
      success: true,
      message: "Product rejected successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductVisibility,
  getPendingProducts,
  validateProduct,
  rejectProduct,
};
