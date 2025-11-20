import express from "express";
import * as orderController from "../../../controllers/orderController.js";
import { authenticate } from "../../../middlewares/auth.js";
import { validate } from "../../../middlewares/validation/validate.js";
import {
    createOrderSchema,
    updateOrderStatusSchema,
} from "../../../middlewares/validation/schemas/orderSchemas.js";
import cache from "../../../middlewares/redisCache.js";
import { createLimiter } from "../../../middlewares/security.js";

const orderRoutes = express.Router();




orderRoutes.post(
    "/",
    createLimiter(15, 100),
    validate(createOrderSchema),
    authenticate,
    orderController.createOrder
);


// orderRoutes.get('/', authenticate, cache('orders', 600), orderController.getOrders);

if (process.env.NODE_ENV !== "test") {
    orderRoutes.get(
        "/",
        createLimiter(15, 100),
        authenticate,
        cache("orders", 600),
        orderController.getOrders
    );
} else {
    orderRoutes.get("/", createLimiter(15, 100), authenticate, orderController.getOrders);
}


// orderRoutes.get('/:id', authenticate ,cache('order', 600), orderController.getOrderById);
if (process.env.NODE_ENV !== "test") {
    orderRoutes.get(
        "/:id",
        createLimiter(15, 100),
        authenticate,
        cache("orders", 600),
        orderController.getOrderById
    );
} else {
    orderRoutes.get("/:id", createLimiter(15, 100), authenticate, orderController.getOrderById);
}

orderRoutes.put(
    "/:id",
    createLimiter(15, 100),
    validate(updateOrderStatusSchema),
    authenticate,
    orderController.updateOrderStatus
);


orderRoutes.delete("/:id", createLimiter(15, 100), authenticate, orderController.cancelOrder);

export default orderRoutes;
