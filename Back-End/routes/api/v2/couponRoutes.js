import express from "express";
import { authenticate, authorize } from "../../../middlewares/auth.js";
import * as couponController from "../../../controllers/couponController.js";
import cache from "../../../middlewares/redisCache.js";
import { validate } from "../../../middlewares/validation/validate.js";
import {
    createCouponSchema,
    updateCouponSchema,
} from "../../../middlewares/validation/schemas/couponSchemas.js";
import { createLimiter } from "../../../middlewares/security.js";

const couponRoutes = express.Router();




couponRoutes.post(
    "/",
    createLimiter(15, 100),
    authenticate,
    authorize(["admin", "seller"]),
    validate(createCouponSchema),
    couponController.createCoupon
);


if (process.env.NODE_ENV !== "test") {
    couponRoutes.get(
        "/seller",
        createLimiter(15, 100),
        authenticate,
        cache("couponsSeller", 600),
        couponController.getCouponsSeller
    );
} else {
    couponRoutes.get(
        "/seller",
        createLimiter(15, 100),
        authenticate,
        couponController.getCouponsSeller
    );
}


couponRoutes.get(
    "/",
    createLimiter(15, 100),
    authenticate,
    cache("coupons", 600),
    authorize(["admin"]),
    couponController.getAllCoupons
);


couponRoutes.get(
    "/:id",
    createLimiter(15, 100),
    authenticate,
    cache("coupon", 600),
    couponController.getCouponById
);


couponRoutes.delete(
    "/:id",
    createLimiter(15, 100),
    authenticate,
    authorize(["admin", "seller"]),
    couponController.deleteCoupon
);


couponRoutes.put(
    "/:id",
    createLimiter(15, 100),
    authenticate,
    authorize(["admin", "seller"]),
    validate(updateCouponSchema),
    couponController.updateCoupon
);

export default couponRoutes;
