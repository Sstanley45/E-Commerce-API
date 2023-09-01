import { StatusCodes } from "http-status-codes";
import Review from "../models/Review.js";
import Product from "../models/ProductModel.js";
import { checkPermissions } from "../utils/index.js";
import {
  NotFoundError,
  BadRequestError,
} from "../errors/index.js";

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({ path: "product", select: "name company price" })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id : ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  //here is where the Product model is used, To check whether the
  //productId submitted is valid.

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }
  //here we check whether already submitted a review for this specific item:
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new BadRequestError("Already Submitted review for this product");
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`no review found with id : ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`no review found with id : ${reviewId}`);
  }
  checkPermissions(req.user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "success!, review deleted" });
};

//alternative Single products reviews
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
}


export {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
  getSingleProductReviews,
};
