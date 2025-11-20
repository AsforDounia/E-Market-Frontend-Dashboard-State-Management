import express from "express";

const categoryRoutes = express.Router();
import * as categoryController from "../../../controllers/categoryController.js";
import { validate } from "../../../middlewares/validation/validate.js";
import {
    createCategorySchema,
    updateCategorySchema,
} from "../../../middlewares/validation/schemas/categorySchema.js";
import cache from "../../../middlewares/redisCache.js";
import { createLimiter } from "../../../middlewares/security.js";




categoryRoutes.get(
    "/",
    createLimiter(15, 100),
    cache("categories", 600),
    categoryController.getAllCategories
);


categoryRoutes.get(
    "/:id",
    createLimiter(15, 100),
    cache("category", 600),
    categoryController.getCategoryById
);


categoryRoutes.post(
    "/",
    createLimiter(15, 100),
    validate(createCategorySchema),
    categoryController.createCategory
);


categoryRoutes.put(
    "/:id",
    createLimiter(15, 100),
    validate(updateCategorySchema),
    categoryController.updateCategory
);


categoryRoutes.delete("/:id", createLimiter(15, 100), categoryController.deleteCategory);

export default categoryRoutes;
