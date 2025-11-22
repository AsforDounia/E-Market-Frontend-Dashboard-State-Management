import {
    Order,
    OrderItem,
    Product,
    Coupon,
    UserCoupon,
    OrderCoupon,
} from "../models/Index.js";
import { AppError } from "../middlewares/errorHandler.js";
import mongoose from "mongoose";
import notificationService from "../services/notificationService.js";
import cacheInvalidation from "../services/cacheInvalidation.js";
const ObjectId = mongoose.Types.ObjectId;

const createOrder = async (req, res, next) => {
    const session = await mongoose.startSession();

    let userId, subtotal, discount, total, orderId;
    try {
        await session.withTransaction(async () => {
            const { couponCodes, cartItems: incomingCartItems, shippingInfo } = req.body;
            userId = req.user.id;

            if (!incomingCartItems || incomingCartItems.length === 0)
                throw new AppError("Cart cannot be empty", 400);

            // Fetch product details for all incoming cart items
            const productIds = incomingCartItems.map((item) => item.productId);
            const products = await Product.find({ _id: { $in: productIds } }).session(session);

            const productMap = products.reduce((map, product) => {
                map[product._id.toString()] = product;
                return map;
            }, {});

            // Calculate subtotal and validate stock
            subtotal = 0;
            const orderProductDetails = [];
            for (const item of incomingCartItems) {
                const product = productMap[item.productId];
                if (!product || product.deletedAt)
                    throw new AppError(`Product with ID ${item.productId} no longer available`, 400);
                if (product.stock < item.quantity)
                    throw new AppError(`Insufficient stock for ${product.title}`, 400);

                subtotal += product.price * item.quantity;
                orderProductDetails.push({ product, quantity: item.quantity });
            }

            //gestion des coupons
            discount = 0;
            const appliedCoupons = [];

            if (couponCodes && Array.isArray(couponCodes) && couponCodes.length > 0) {
                let currentSubtotal = subtotal;

                for (const couponCode of couponCodes) {
                    const coupon = await Coupon.findOne({
                        code: couponCode,
                        isActive: true,
                    }).session(session);
                    if (!coupon) throw new AppError(`Invalid coupon: ${couponCode}`, 400);
                    if (coupon.expiresAt && coupon.expiresAt < new Date())
                        throw new AppError(`Coupon expired: ${couponCode}`, 400);

                    // Check if user has already used this coupon
                    const existingUsage = await UserCoupon.findOne({
                        user: userId,
                        coupon: coupon._id,
                    }).session(session);
                    if (existingUsage)
                        throw new AppError(`Coupon already used: ${couponCode}`, 400);

                    // Check usage limit
                    if (coupon.usageLimit) {
                        const usageCount = await UserCoupon.countDocuments({
                            coupon: coupon._id,
                        }).session(session);
                        if (usageCount >= coupon.usageLimit)
                            throw new AppError(`Coupon usage limit reached: ${couponCode}`, 400);
                    }

                    if (currentSubtotal < coupon.minAmount)
                        throw new AppError(
                            `Minimum amount ${coupon.minAmount} required for coupon: ${couponCode}`,
                            400
                        );

                    // calcul du montant du reduction
                    let couponDiscount = 0;
                    if (coupon.type === "percentage") {
                        couponDiscount = (currentSubtotal * coupon.value) / 100;
                        if (coupon.maxDiscount)
                            couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
                    } else {
                        couponDiscount = Math.min(coupon.value, currentSubtotal);
                    }

                    discount += couponDiscount;
                    currentSubtotal -= couponDiscount;

                    appliedCoupons.push({
                        couponId: coupon._id,
                        discountAmount: couponDiscount,
                    });

                    // Record coupon usage in UserCoupon
                    await UserCoupon.create(
                        [
                            {
                                user: userId,
                                coupon: coupon._id,
                            },
                        ],
                        { session }
                    );
                }
            }

            total = subtotal - discount;

            // creation de la commande
            const order = await Order.create(
                [
                    {
                        userId,
                        subtotal,
                        discount,
                        total,
                        shippingInfo, // Add shipping info to the order
                    },
                ],
                { session }
            );

            orderId = order[0]._id;

            // Create OrderCoupon records for the applied coupons
            if (appliedCoupons.length > 0) {
                const orderCoupons = appliedCoupons.map((coupon) => ({
                    orderId: order[0]._id,
                    couponId: coupon.couponId,
                    discountAmount: coupon.discountAmount,
                }));

                await OrderCoupon.insertMany(orderCoupons, { session });
            }

            for (const item of orderProductDetails) {
                await OrderItem.create(
                    [
                        {
                            orderId: order[0]._id,
                            productId: item.product._id,
                            sellerId: item.product.sellerId,
                            productTitle: item.product.title,
                            quantity: item.quantity,
                            priceAtOrder: item.product.price,
                        },
                    ],
                    { session }
                );

                await Product.updateOne(
                    { _id: item.product._id },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }
            // Cart clearing logic is moved to frontend or removed as cart is not managed in backend in this flow
        });

        notificationService.emitOrderCreated({ orderId, total, userId });

        // Invalidate orders cache
        await cacheInvalidation.invalidateUserOrders(userId);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: {
                order: {
                    orderId,
                    userId,
                    subtotal,
                    discount,
                    total,
                },
            },
        });
    } catch (error) {
        next(error);
    } finally {
        await session.endSession();
    }
};

const getOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        let filter = {};

        if (req.user.role === 'seller') {
            const orderIds = await OrderItem.find({ sellerId: userId }).distinct('orderId');
            filter = { _id: { $in: orderIds } };
        } else if (req.user.role === 'admin') {
            // Admin can see all orders, or filter by userId if provided in query
            // For now, let's assume admin sees all if no specific filter
            // But usually admin has a separate dashboard. 
            // If we want to reuse this for admin:
            filter = {};
        } else {
            // Buyer sees their own orders
            filter = { userId };
        }
        if (status) filter.status = status;

        const skip = (Number(page) - 1) * Number(limit);

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const totalOrders = await Order.countDocuments(filter);
        // Populate coupons for each order
        const ordersWithCoupons = await Promise.all(
            orders.map(async (order) => {
                const orderCoupons = await OrderCoupon.find({ orderId: order._id }).populate(
                    "couponId",
                    "code type value"
                );

                const itemCount = await OrderItem.countDocuments({ orderId: order._id });

                return {
                    ...order.toObject(),
                    itemCount,
                    coupons: orderCoupons,
                };
            })
        );

        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            metadata: {
                total: totalOrders,
                currentPage: Number(page),
                totalPages: Math.ceil(totalOrders / Number(limit)),
                pageSize: Number(limit),
                hasNextPage: Number(page) < Math.ceil(totalOrders / Number(limit)),
                hasPreviousPage: Number(page) > 1,
            },
            data: {
                orders: ordersWithCoupons,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) throw new AppError("Invalid order ID", 400);

        const order = await Order.findById(id);
        if (!order) throw new AppError("Order not found", 404);

        // Authorization check: only order owner or admin can view
        const userId = req.user.id;
        const isOwner = order.userId.toString() === userId.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            throw new AppError("You are not authorized to view this order", 403);
        }

        const items = await OrderItem.find({ orderId: id }).populate("productId", "title price stock");

        for (const item of items) {
            item.productId._doc.primaryImage = item.productId.imageUrls.length > 0 ? item.productId.imageUrls[0] : null;
        }
        // Get coupons used in this order
        const orderCoupons = await OrderCoupon.find({ orderId: id }).populate(
            "couponId",
            "code type value"
        );

        res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            data: {
                order: {
                    ...order.toObject(),
                    items,
                    coupons: orderCoupons,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) throw new AppError("Invalid order ID", 400);
        const { status } = req.body;

        const validStatuses = ["pending", "paid", "shipped", "delivered"];
        if (!validStatuses.includes(status)) throw new AppError("Invalid status", 400);

        const order = await Order.findById(id);
        if (!order) throw new AppError("Order not found", 404);

        // Authorization check: only admin can update order status
        if (req.user.role !== "admin") {
            throw new AppError("Only admins can update order status", 403);
        }

        if (order.status === "cancelled" || order.status === "delivered") {
            throw new AppError(`Cannot update ${order.status} order`, 400);
        }

        order.status = status;
        await order.save();

        const notData = { orderId: id, status, orderUserId: order.userId };
        notificationService.emitOrderUpdated(notData, "ORDER_UPDATED");

        // Invalidate orders cache
        await cacheInvalidation.invalidateUserOrders(order.userId);

        res.status(200).json({
            success: true,
            message: "Order status updated",
            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    }
};

const cancelOrder = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) throw new AppError("Invalid order ID", 400);
            const userId = req.user.id;

            const order = await Order.findOne({ _id: id }).session(session);
            if (!order) throw new AppError("Order not found", 404);

            const isOwner = order.userId.toString() === userId.toString();
            const isAdmin = req.user.role === "admin";

            if (!isOwner && !isAdmin) {
                throw new AppError("You are not allowed to cancel this order", 403);
            }

            if (order.status === "cancelled") {
                throw new AppError("Order already cancelled", 400);
            }

            if (order.status !== "pending") {
                throw new AppError("Only pending orders can be cancelled", 400);
            }

            const orderItems = await OrderItem.find({ orderId: id }).session(session);
            for (const item of orderItems) {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }

            // Get all coupons used in this order and remove usage records
            const orderCoupons = await OrderCoupon.find({ orderId: id }).session(session);
            for (const orderCoupon of orderCoupons) {
                await UserCoupon.deleteOne(
                    { user: order.userId, coupon: orderCoupon.couponId },
                    { session }
                );
            }

            order.status = "cancelled";
            await order.save({ session });
        });

        const order = await Order.findById(req.params.id);
        const notData = { orderId: req.params.id, orderUserId: order.userId };
        notificationService.emitOrderUpdated(notData, "ORDER_CANCELLED");

        // Invalidate orders cache
        await cacheInvalidation.invalidateUserOrders(order.userId);

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        await session.endSession();
    }
};

const checkout = async (req, res, next) => {
    try {
        // Simulate payment processing
        const isSuccess = Math.random() < 0.5;

        if (isSuccess) {
            res.status(200).json({
                success: true,
                message: "Payment successful",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment failed",
            });
        }
    } catch (error) {
        next(error);
    }
};

export { createOrder, getOrders, getOrderById, updateOrderStatus, cancelOrder, checkout };
