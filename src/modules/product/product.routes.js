import express from "express";
import {
  addProduct,
  getProductsWithCategory,
  products,
  updateProduct,
} from "./controller/product.controller.js";
import { auth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { productSchema, updateProductSchema } from "./product.validation.js";

const productRoutes = express.Router();

productRoutes.get("/product", products);

productRoutes.get("/products/category", getProductsWithCategory);

productRoutes.post("/product", auth, validate(productSchema), addProduct);

productRoutes.patch(
  "/product/:id",
  auth,
  validate(updateProductSchema),
  updateProduct
);

export default productRoutes;