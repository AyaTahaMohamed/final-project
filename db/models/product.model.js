import mongoose from "mongoose";

export const producSchema = mongoose.Schema({
  productName: String,
  slug: String,
  priceAfterDiscount: Number,
  finalPrice: Number,
  image: String,
  stock: Number,
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
});

const productModel = mongoose.model("Product", producSchema);
export default productModel;