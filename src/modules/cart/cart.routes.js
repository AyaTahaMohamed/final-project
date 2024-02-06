import express from "express";
import { createCart, updateCart } from "./controller/cart.controller.js";
import { auth } from "../../middlewares/auth.js";
const cartRoutes = express.Router();

cartRoutes.post("/cart", auth, createCart);

cartRoutes.patch("/cart", auth ,updateCart);

export default cartRoutes;