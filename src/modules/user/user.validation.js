import Joi from "joi";

export const addUserSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20).required(),
  age: Joi.number().min(15).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp(/^[A-Z][a-z0-9]{3,8}$/))
    .required(),
  Cpassword: Joi.ref("password"),
  address: Joi.array(),
});

export const updateuservalidation = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20).required(),
  age: Joi.number().min(15).max(50).required(),
  email: Joi.string().email().required(),
});