import express  from "express";
import { addcategory,  addimg, deleteCategory, getAllCategories, getCategoryByName, updateCategory } from "./controller/category.controller.js"

import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import Categorymodel from "../../../db/models/category.js";
import { adminAuth, auth } from "../../middleware/auth.js";
import { addCategrySchema, updateCategrySchema } from "./category.validation.js";
import { validation } from "../../middleware/validation.js";
uuidv4();
const categoryRoutes = express.Router()


categoryRoutes.post("/category", addimg, validation(addCategrySchema),adminAuth , addcategory);
categoryRoutes.get('/category', getAllCategories)
categoryRoutes.get('/categoryName', getCategoryByName)
categoryRoutes.patch("/category/:categoryId",validation(updateCategrySchema),auth, updateCategory) 
categoryRoutes.delete("/category/:id",adminAuth, deleteCategory) 





export default categoryRoutes;
