import mongoose from "mongoose";
import { producSchema } from "./product.model.js";


const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  priceAfterDiscount: {
    type: Number,
    default: 0,
  },
  products: [producSchema],
});

const cartModel = mongoose.model("Cart", cartSchema);
export default cartModel;