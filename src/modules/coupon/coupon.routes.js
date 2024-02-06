import express from "express";
import { addCoupon, applyCoupon, coupons, deleteCoupon, updateCoupon } from "./controller/coupon.controller.js";
import { auth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { couponSchema } from "./coupon.validation.js";
const couponRoutes = express.Router();

couponRoutes.get("/coupon", coupons);
couponRoutes.post("/coupon", validate(couponSchema), auth, addCoupon);

couponRoutes.put('/coupon' , auth, updateCoupon)

couponRoutes.patch('/coupon', auth, applyCoupon)

couponRoutes.delete('/coupon', auth, deleteCoupon)

export default couponRoutes;