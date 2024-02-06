


import cartModel from "../../../../db/models/cart.model.js";
import productModel from "../../../../db/models/product.model.js";
import userModel from "../../../../db/models/user.model.js";



export const createCart = async (req, res) => {
  const user = await userModel.findById(req.userId);
  console.log(user);
  if (!user) return res.send({ failed: "user not found" });
  const cart = await cartModel.find({ userId: user._id });
  const newCart = await cartModel.insertMany({
    userId: user._id,
    totalPrice: 0,
    priceAfterDiscount: 0,
    products: [],
  });
  res.send({ created: newCart });
  if (cart.length == 0) return res.send({ message: "empty cart" });
};

export const updateCart = async (req, res) => {
  const { cartId, productNames } = req.body;
  console.log(productNames);

  try {
    const products = await productModel.find({
      productName: { $in: productNames },
    });

    if (!products || products.length === 0) {
      return res.send({ failed: "No products found" });
    }
    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { $push: { products: { $each: products } } },
      { new: true }
    );

    const totalPrice = updatedCart.products.reduce(
      (accumulator, product) => accumulator + product.finalPrice,
      0
    );

    const priceAfterDiscount = updatedCart.products.reduce(
      (accumulator, product) => accumulator + product.priceAfterDiscount,
      0
    );

    await cartModel.findByIdAndUpdate(cartId, {
      totalPrice: totalPrice,
      priceAfterDiscount: priceAfterDiscount,
    });
    res.send({ message: "success", cart: updatedCart });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error updating cart", errorMessage: error.message });
  }
};
