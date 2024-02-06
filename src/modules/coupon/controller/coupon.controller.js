import couponModel from "../../../db/models/coupon.model.js";

import userModel from "../../../../db/models/user.model.js";
import productModel from "../../../../db/models/product.model.js";

export const coupons = async (req, res) => {
  const coupons = await couponModel.find();
  if (!coupons) return res.send({ message: "failed" });
  res.send({ message: "success", coupons: coupons });
};

export const addCoupon = async (req, res) => {
  const createdBy = req.userId;
  const { couponCode, value, expireIn } = req.body;
  const foundedCoupon = await couponModel.findOne({ couponCode });
  if (foundedCoupon) return res.send({ message: " already exists" });
  const newCoupon = await couponModel.insertMany({
    couponCode,
    value,
    expireIn,
    createdBy,
  });
  if (newCoupon) return res.send(newCoupon);
  res.send({ message: " cant find coupon" });
};

export const updateCoupon = async (req, res) => {
  const user = await userModel.findById(req.userId);
  const { couponCode, newName, value, expireIn } = req.body;
  const coupon = await couponModel.findOne({ couponCode });
  if (!coupon) return res.send({ message: " cant find coupon" });
  if (user._id.equals(coupon.createdBy) || user.role == "admin") {
    await couponModel.findOneAndUpdate(
      { couponCode },
      {
        couponCode: newName,
        value,
        expireIn,
        updatedBy: user._id,
      }
    );
    return res.send({ message: "updated" });
  } else {
    return res.send({ message: "can't update coupon" });
  }
};

export const applyCoupon = async (req, res) => {
  const { productName, couponCode } = req.body;
  const product = await productModel.findOne({ productName });

  if (!product) return res.send({ message: "product not found" });
  const coupon = await couponModel.findOne({ couponCode });
  if (!coupon) return res.send({ message: "coupon not found" });
  if (coupon.deleted === true) return res.send({ message: " deleted coupon" });
  const priceAfterDiscount = product.finalPrice - coupon.value;

  await productModel.findOneAndUpdate(
    { productName },
    {
      priceAfterDiscount,
    }
  );

  const productAfterUpdate = await productModel.findOne({ productName });
  res.send({ message: "coupon applied", product: productAfterUpdate });
};

export const deleteCoupon = async (req, res) => {
  const user = await userModel.findById(req.userId);
  const { couponCode } = req.body;
  const coupon = await couponModel.findOne({ couponCode });
  if (!coupon) return res.send({ message: "coupon not found" });
  if (user._id.equals(coupon.createdBy) || user.role == "admin") {
    await couponModel.findOneAndUpdate(
      { couponCode },
      {
        deleted: true,
        deletedBy: user._id,
      }
    );
    res.send({ message: "deleted" });
  } else {
    res.send({ message: "can't delete" });
  }
};