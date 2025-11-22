import express from "express";
import * as productController from "../../../controllers/productController.js";
import { validate } from "../../../middlewares/validation/validate.js";
import {
    createProductSchema,
    updateProductSchema,
} from "../../../middlewares/validation/schemas/productSchema.js";

const productRoutes = express.Router();





productRoutes.get("/", productController.getAllProducts);


productRoutes.get("/:id", productController.getProductById);


productRoutes.post("/", validate(createProductSchema), productController.createProduct);


productRoutes.put("/:id", validate(updateProductSchema), productController.updateProduct);


productRoutes.delete("/:id", productController.deleteProduct);

export default productRoutes;
