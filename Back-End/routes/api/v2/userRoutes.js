import express from "express";
import * as usertController from "../../../controllers/userController.js";
import { validate } from "../../../middlewares/validation/validate.js";
import { createUserSchema } from "../../../middlewares/validation/schemas/userSchema.js";
import { authenticate, authorize } from "../../../middlewares/auth.js";
import cache from "../../../middlewares/redisCache.js";
import { createLimiter } from "../../../middlewares/security.js";
import { upload } from "../../../config/multer.js";

const userRoutes = express.Router();


userRoutes.get(
    "/",
    createLimiter(15, 100),
    cache("users", 600),
    authenticate,
    authorize(["admin"]),
    usertController.getAllUsers
);

userRoutes.get(
    "/profile",
    createLimiter(15, 100),
    cache("userProfile", 600),
    authenticate,
    usertController.getUserProfile
);

userRoutes.get(
    "/:id",
    createLimiter(15, 100),
    cache("user", 600),
    authenticate,
    authorize(["admin"]),
    usertController.getUserById
);



userRoutes.post(
    "/",
    createLimiter(15, 100),
    validate(createUserSchema),
    authenticate,
    authorize("admin"),
    usertController.createUser
);


userRoutes.delete(
    "/:id",
    createLimiter(15, 100),
    authenticate,
    authorize(["admin"]),
    usertController.deleteUser
);

userRoutes.put("/profile", createLimiter(15, 100), authenticate, usertController.updateProfile);
userRoutes.put('/profile/password', authenticate, usertController.updatePassword);
userRoutes.put('/profile/avatar', authenticate, upload.single('avatar'), usertController.updateAvatar);
userRoutes.patch(
    "/:id/role",
    createLimiter(15, 100),
    authenticate,
    authorize("admin"),
    usertController.updateUserRole
);

export default userRoutes;
