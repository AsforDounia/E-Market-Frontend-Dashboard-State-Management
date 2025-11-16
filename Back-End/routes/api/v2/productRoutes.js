import express from "express";

const productRoutes = express.Router();
import * as productController from "../../../controllers/productController.js";
import { validate } from "../../../middlewares/validation/validate.js";
import {
    createProductSchema,
    updateProductSchema,
} from "../../../middlewares/validation/schemas/productSchema.js";
import { authenticate, authorize } from "../../../middlewares/auth.js";
import { upload } from "../../../middlewares/upload.js";
import { optimizeImages } from "../../../middlewares/optimizeImages.js";
import cache from "../../../middlewares/redisCache.js";
import { createLimiter } from "../../../middlewares/security.js";





productRoutes.get(
    "/",
    createLimiter(15, 100),
    cache("products", 600),
    productController.getAllProducts
);

productRoutes.get(
    "/pending",
    createLimiter(15, 100),
    authenticate,
    cache("pendingProducts", 600),
    authorize("admin"),
    productController.getPendingProducts
);


productRoutes.get(
    "/:id",
    createLimiter(15, 100),
    cache("product", 600),
    productController.getProductById
);
productRoutes.get('/slug/:slug', productController.getProductBySlug);

productRoutes.post(
    "/",
    createLimiter(15, 100),
    authenticate,
    authorize("seller"),
    upload.array("images", 5),
    optimizeImages,
    productController.createProduct
);


productRoutes.put(
    "/:id",
    createLimiter(15, 100),
    authenticate,
    validate(updateProductSchema),
    authorize("seller"),
    productController.updateProduct
);


productRoutes.delete(
    "/:id",
    createLimiter(15, 100),
    authenticate,
    authorize(["seller", "admin"]),
    productController.deleteProduct
);

productRoutes.patch(
    "/:id/visibility",
    createLimiter(15, 100),
    authenticate,
    authorize("seller"),
    productController.updateProductVisibility
);
productRoutes.patch(
    "/:id/validate",
    createLimiter(15, 100),
    authenticate,
    authorize("admin"),
    productController.validateProduct
);
productRoutes.patch(
    "/:id/reject",
    createLimiter(15, 100),
    authenticate,
    authorize("admin"),
    productController.rejectProduct
);

export default productRoutes;
