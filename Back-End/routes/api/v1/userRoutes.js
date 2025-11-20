import express from "express";
import * as usertController from "../../../controllers/userController.js";
import { validate } from "../../../middlewares/validation/validate.js";
import { createUserSchema } from "../../../middlewares/validation/schemas/userSchema.js";

const userRoutes = express.Router();




userRoutes.get("/", usertController.getAllUsers);


userRoutes.get("/:id", usertController.getUserById);


userRoutes.post("/", validate(createUserSchema), usertController.createUser);


userRoutes.delete("/:id", usertController.deleteUser);

export default userRoutes;
