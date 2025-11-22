import express from "express";
import * as reviewController from "../../../controllers/reviewController.js";
import { authenticate, authorize } from "../../../middlewares/auth.js";
import { validate } from "../../../middlewares/validation/validate.js";
import {
    createReviewSchema,
    updateReviewSchema,
} from "../../../middlewares/validation/schemas/reviewSchemas.js";
import cache from "../../../middlewares/redisCache.js";
import { createLimiter } from "../../../middlewares/security.js";

const reviewRoutes = express.Router();




reviewRoutes.post(
    "/",
    createLimiter(15, 100),
    authenticate,
    validate(createReviewSchema),
    reviewController.addReview
);


reviewRoutes.get(
    "/:productId",
    createLimiter(15, 100),
    cache("productReviews", 600),
    reviewController.getProductReviews
);


reviewRoutes.put(
    "/:reviewId",
    createLimiter(15, 100),
    authenticate,
    validate(updateReviewSchema),
    reviewController.updateReview
);


reviewRoutes.delete(
    "/:reviewId",
    createLimiter(15, 100),
    authenticate,
    createLimiter(15, 100),
    reviewController.deleteReview
);

reviewRoutes.get(
    "/",
    createLimiter(15, 100),
    authenticate,
    authorize("admin"),
    reviewController.getAllReviews
);

reviewRoutes.patch(
    "/:reviewId/status",
    createLimiter(15, 100),
    authenticate,
    authorize("admin"),
    reviewController.updateReviewStatus
);

reviewRoutes.post(
    "/:reviewId/report",
    createLimiter(15, 100),
    authenticate,
    reviewController.reportReview
);

export default reviewRoutes;
