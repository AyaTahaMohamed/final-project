import 'dotenv/config'

import express  from "express";
import initconnection from "./db/initconnection.js";
import userRoutes from "./src/modules/user/user.routes.js";
import categoryRoutes from "./src/modules/category/category.routes.js";
import productRoutes from './src/modules/product/product.routes.js';
import couponRoutes from "./src/modules/coupon/coupon.routes.js";
import cartRoutes from './src/modules/cart/cart.routes.js';

import cors from 'cors';

const server = express()
server.use("/uploads", express.static("uploads  "))
server.use(cors());
server.use('*',cors());
server.use(express.json())

initconnection()
 
server.use(userRoutes)
server.use(categoryRoutes)
server.use(productRoutes)
server.use(couponRoutes)
server.use(cartRoutes)







server.listen(3000)