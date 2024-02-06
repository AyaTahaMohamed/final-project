import express  from "express";
import { deleteUser, forgetPassword, getAllUser, signIn, signUp, updateUser, verification } from "./controller/user.controller.js";
import { validation } from "../../middleware/validation.js";
import { addUserSchema, updateuservalidation } from "./users.validation.js";
import { adminAuth, auth } from "../../middleware/auth.js";
const userRoutes = express.Router()


userRoutes.post("/users/signup",validation(addUserSchema), signUp)
userRoutes.post("/users/signin", signIn) 


userRoutes.get('/users', getAllUser)


userRoutes.get('/user/verify/:token', verification)


userRoutes.patch("/user/:id",validation(updateuservalidation),adminAuth, updateUser)


userRoutes.delete("/user/:id", deleteUser)

userRoutes.post('/forgetPassword', forgetPassword);





    export default userRoutes;