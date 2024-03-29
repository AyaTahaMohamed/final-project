import userModel from "../../../../db/models/user.model.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendOurEmail,
  sendResetPasswordMail,
} from "../../../services/sendEmail.js";
import randomstring from "randomstring";

export const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json({ message: "ok Done", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signUp = async (req, res) => {
  let { userName, age, email, password, Cpassword, address } = req.body;
  if (password != Cpassword)
    return res.json({ message: "password and correct password should match" });
  let foundeduser = await userModel.findOne({ email: req.body.email });
  console.log(foundeduser);
  if (foundeduser) {
    res.send("user already rejester ");
  } else {
    let hashedpassword = bcrypt.hashSync(password, 10);
    let addeduser = await userModel.insertMany({
      userName,
      age,
      email,
      address,
      password: hashedpassword,
    });
    let token = jwt.sign({ id: addeduser[0]._id }, "Newuser");
    let url = `http://localhost:5000/user/verify/${token}`;
    sendOurEmail(email, url);
    res.json({ message: "added", addeduser });
  }
};

export const verification = async (req, res) => {
  let { token } = req.params;
  jwt.verify(token, "Newuser", async (err, decoded) => {
    let foundeduser = await userModel.findById(decoded.id);
    if (!foundeduser) return res.json({ message: "invalid user" });
    let updateduser = await userModel.findByIdAndUpdate(
      decoded.id,
      { isverified: true },
      { new: true }
    );
    res.json({ message: "verification Done", updateduser });
  });
};

export const signIn = async (req, res, next) => {
  let { email, password } = req.body;
  let foundedUser = await userModel.findOne({ email });
  if (!foundedUser) return res.json({ message: "u need to register first" });
  if (!foundedUser.isverified)
    return res.json({ message: "please verify your account first " });
  let matchedPassword = bcrypt.compareSync(password, foundedUser.password);
  if (matchedPassword) {
    let token = jwt.sign(
      { id: foundedUser.id, role: foundedUser.role },
      "Hello"
    );
    res.json({ message: "welcome", token });
  } else {
    res.json({ message: "Invalid password" });
  }
};

export const updateUser = async (req, res) => {
  let foundedUser = await userModel.findById(req.params.id);
  if (foundedUser) {
    let { userName, age, email , address} = req.body;
    let updateduser = await userModel.findByIdAndUpdate(
      foundedUser._id,
      { userName, age, email, address },
      { new: true }
    );
    res.json({ message: "Updated", updateduser });
  } else {
    res.json({ message: "user not found" });
  }
};

export const deleteUser = async (req, res) => {
  let foundeduser = await userModel.findByIdAndDelete(req.params.id);
  if (foundeduser) {
    res.json({ message: "User Deleted", foundeduser });
  } else {
    res.json({ message: "user not found" });
  }
};

export const securePassword = async (password) => {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const foundUser = await userModel.findOne({ email });

    if (foundUser) {
      const randomCode = randomstring.generate();
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 15);

      const updatedDate = await userModel.updateOne(
        { email },
        { $set: { resetCode: randomCode, resetCodeExpiration: expirationTime } }
      );

      ///reset password
      sendResetPasswordMail(foundUser.userName, foundUser.email, randomCode);

      return res
        .status(200)
        .json({ message: "Please check your email for the verification code" });
    } else {
      return res.status(404).json({ message: { message: "User not found" } });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};