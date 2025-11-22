import { Order, OrderItem, Product, Review } from "../models/Index.js";
import { AppError } from "../middlewares/errorHandler.js";
import mongoose from "mongoose";
import cacheInvalidation from "../services/cacheInvalidation.js";
import { getReviewsForProduct } from "../services/reviewService.js";
const ObjectId = mongoose.Types.ObjectId;

const addReview = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;
        if (!ObjectId.isValid(productId)) throw new AppError("Invalid product ID", 400);
        const userId = req.user.id;

        const product = await Product.findById(productId);
        if (!product) throw new AppError("Product not found", 404);

        // TEMPORARILY DISABLED - Allow reviews without purchase validation
        // TODO: Re-enable after implementing proper payment flow
        /*
        // Check if user has purchased this product
        const orderItems = await OrderItem.find({ productId }).select('orderId');
        const orderIds = orderItems.map(item => item.orderId);

        const validOrder = await Order.findOne({
            _id: { $in: orderIds },
            userId,
            status: { $in: ["paid", "shipped", "delivered"] },
        });

        console.log('Purchase validation:', {
            productId,
            userId,
            orderItemsFound: orderItems.length,
            orderIds: orderIds.length,
            validOrder: !!validOrder
        });

        if (!validOrder) {
            throw new AppError("You can only review products you have purchased", 403);
        }
        */

        const existingReview = await Review.findOne({ userId, productId, deletedAt: null });
        if (existingReview) throw new AppError("You have already reviewed this product", 400);

        const review = await Review.create({ userId, productId, rating, comment });

        // Invalidate product reviews cache
        await cacheInvalidation.invalidateProductReviews(productId);

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: {
                review
            }
        });
    } catch (error) {
        next(error);
    }
};

const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        if (!ObjectId.isValid(productId)) throw new AppError("Invalid product ID", 400);

        const product = await Product.findById(productId);
        if (!product) throw new AppError("Product not found", 404);

        const { reviews, averageRating } = await getReviewsForProduct(productId);

        res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully",
            data: { reviews, averageRating },
        });
    } catch (error) {
        next(error);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        if (!ObjectId.isValid(reviewId)) throw new AppError("Invalid review ID", 400);
        const { rating, comment } = req.body;

        const review = await Review.findOneAndUpdate(
            { _id: reviewId, userId: req.user.id, deletedAt: null },
            { rating, comment },
            { new: true }
        );

        if (!review) throw new AppError("Review not found", 404);

        // Invalidate product reviews cache
        await cacheInvalidation.invalidateProductReviews(review.productId);

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: {
                review
            }
        });
    } catch (error) {
        next(error);
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        if (!ObjectId.isValid(reviewId)) throw new AppError("Invalid review ID", 400);

        const review = await Review.findOne({ _id: reviewId, deletedAt: null });

        if (!review) throw new AppError("Review not found", 404);

        if (review.userId.toString() !== req.user.id && req.user.role !== "admin") {
            throw new AppError("You are not authorized to delete this review", 403);
        }

        review.deletedAt = new Date();
        await review.save();

        // Invalidate product reviews cache
        await cacheInvalidation.invalidateProductReviews(review.productId);

        res.status(200).json({
            success: true,
            message: "Review soft-deleted successfully",
            data: {
                review
            }
        });
    } catch (error) {
        next(error);
    }
};
const getAllReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, isReported, search } = req.query;
        const query = { deletedAt: null };

        if (status) query.status = status;
        if (isReported === 'true') query.isReported = true;
        if (search) {
            query.comment = { $regex: search, $options: 'i' };
        }

        const reviews = await Review.find(query)
            .populate('userId', 'fullname email avatarUrl')
            .populate('productId', 'title imageUrls')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Review.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                reviews,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateReviewStatus = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            throw new AppError("Invalid status", 400);
        }

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { status },
            { new: true }
        );

        if (!review) throw new AppError("Review not found", 404);

        // Invalidate cache
        await cacheInvalidation.invalidateProductReviews(review.productId);

        res.status(200).json({
            success: true,
            message: `Review ${status} successfully`,
            data: { review }
        });
    } catch (error) {
        next(error);
    }
};

const reportReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { isReported: true },
            { new: true }
        );

        if (!review) throw new AppError("Review not found", 404);

        res.status(200).json({
            success: true,
            message: "Review reported successfully"
        });
    } catch (error) {
        next(error);
    }
};

export { addReview, getProductReviews, updateReview, deleteReview, getAllReviews, updateReviewStatus, reportReview };
