import { StatusCodes } from "http-status-codes";
import ProductModel from "../models/ProductModel.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import path from "path";
import url from "url";

//
//     import.meta.url to get the current file's as a URL
//     url.fileURLToPath to change the URL to a path
//     path.dirname to get the directory name

// Using these methods, we can reconstruct the global __dirname and __filename variables that are available to use in CommonJS:

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await ProductModel.create(req.body);
  res.status(StatusCodes.OK).json({ product: product });
};

const getAllProducts = async (req, res) => {
  const products = await ProductModel.find({})
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await ProductModel.findOne({ _id: productId }).populate("reviews");
  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await ProductModel.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "success!, product removed " });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await ProductModel.findOneAndUpdate(
    { _id: productId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("no image uploaded");
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("please upload an image");
  }
  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new BadRequestError("please upload an image smaller than 1mb");
  }

  //move the uploaded image to the public folder, first grab the path
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  //the mv function is accessible because we have the express-fileupload
  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

export {
  createProduct,
  getAllProducts,
  deleteProduct,
  getSingleProduct,
  updateProduct,
  uploadImage,
};
