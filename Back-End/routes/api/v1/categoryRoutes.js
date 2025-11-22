import express from "express";
import * as categoryController from "../../../controllers/categoryController.js";
import { validate } from "../../../middlewares/validation/validate.js";
import {
    createCategorySchema,
    updateCategorySchema,
} from "../../../middlewares/validation/schemas/categorySchema.js";

const categoryRoutes = express.Router();




categoryRoutes.get("/", categoryController.getAllCategories);


categoryRoutes.get("/:id", categoryController.getCategoryById);


categoryRoutes.post("/", validate(createCategorySchema), categoryController.createCategory);


categoryRoutes.put("/:id", validate(updateCategorySchema), categoryController.updateCategory);


categoryRoutes.delete("/:id", categoryController.deleteCategory);

export default categoryRoutes;
