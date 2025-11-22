import express from "express";
import * as notificationController from "../../../controllers/notificationController.js";
import { authenticate } from "../../../middlewares/auth.js";
import cache from "../../../middlewares/redisCache.js";
import { createLimiter } from "../../../middlewares/security.js";

const notificationRoutes = express.Router();




notificationRoutes.get(
    "/",
    createLimiter(15, 100),
    authenticate,
    cache("notifications", 60),
    notificationController.getNotifications
);


notificationRoutes.patch(
    "/:id/read",
    createLimiter(15, 100),
    authenticate,
    notificationController.markAsRead
);

export default notificationRoutes;
