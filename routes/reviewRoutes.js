import express from "express";
const router = express.Router();
import {
  authenticateUser,
} from "../middleware/authentication.js";

import {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
} from "../controllers/reviewControllers.js";

router.route("/").get(getAllReviews).post(authenticateUser, createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

export default router;
