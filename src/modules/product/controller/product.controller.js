import categoryModel from "../../../../db/models/category.model.js";
import productModel from "../../../../db/models/product.model.js";
import userModel from "../../../../db/models/user.model.js";

export const products = async (req, res) => {
  const { productName } = req.body;
  if (productName) {
    const product = await productModel.findOne({ productName });
    res.send({ found: product });
  } else {
    const products = await productModel.find();
    res.send({ found: products });
  }
};

export const getProductsWithCategory = async (req, res) => {
  const { category } = req.body;
  const theCategory = await categoryModel.findOne({ categoryName: category });
  if (!theCategory) {
    return res.send({ message: "this category does not exist" });
  } else {
    const products = await productModel.find({ category: theCategory._id });
    res.send({ category: category, data: products });
  }
};

export const addProduct = async (req, res) => {
  const {
    productName,
    slug,
    priceAfterDiscount,
    finalPrice,
    image,
    stock,
    category,
  } = req.body;
  const createdBy = req.userId;

  const existingProduct = await productModel.findOne({ productName });
  if (existingProduct)
    return res.send({ message: "this product already exists" });

  const theCategory = await categoryModel.findOne({ categoryName: category });
  if (!theCategory) res.send({ message: "this category does not exist" });

  const newProduct = await productModel.insertMany({
    productName,
    slug,
    priceAfterDiscount,
    finalPrice,
    image,
    stock,
    createdBy,
    category: theCategory._id,
  });
  res.send({ created: newProduct });
};

export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById(req.userId);
  const foundedProduct = await productModel.findById(id);
  if (!foundedProduct) return res.send({ message: "product not found" });
  if (foundedProduct) {
    if (user._id.equals(foundedProduct.createdBy) || user.role == "admin") {
      const {
        productName,
        slug,
        priceAfterDiscount,
        finalPrice,
        image,
        stock,
        category,
      } = req.body;
      const foundedCategory = await categoryModel.findOne({
        categoryName: category,
      });
      if (!foundedCategory)
        return res.json({ message: "failed, this category does not exist" });
      await productModel.findByIdAndUpdate(id, {
        productName,
        slug,
        priceAfterDiscount,
        finalPrice,
        image,
        stock,
        category: foundedCategory._id,
      });

      const updatedProduct = await productModel.findById(id);
      res.json({ message: "updated", product: updatedProduct });
    } else {
      res.json({ message: " cant update" });
    }
  }
};