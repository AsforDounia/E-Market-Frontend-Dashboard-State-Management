import express from "express";
import * as cartController from "../../../controllers/cartController.js";
import { authenticate } from "../../../middlewares/auth.js";
import { validate } from "../../../middlewares/validation/validate.js";
import {
    addToCartSchema,
    updateCartItemSchema,
} from "../../../middlewares/validation/schemas/cartSchemas.js";
import cache from "../../../middlewares/redisCache.js";
import { createLimiter } from "../../../middlewares/security.js";

const cartRoutes = express.Router();




cartRoutes.post(
    "/add",
    createLimiter(15, 100),
    authenticate,
    validate(addToCartSchema),
    cartController.addToCart
);


cartRoutes.get(
    "/",
    createLimiter(15, 100),
    authenticate,
    cache("cart", 600),
    cartController.getCart
);


cartRoutes.put(
    "/item/:productId",
    createLimiter(15, 100),
    authenticate,
    validate(updateCartItemSchema),
    cartController.updateCartItem
);


cartRoutes.delete(
    "/item/:productId",
    createLimiter(15, 100),
    authenticate,
    cartController.removeFromCart
);


cartRoutes.delete("/", createLimiter(15, 100), authenticate, cartController.clearCart);

export default cartRoutes;
