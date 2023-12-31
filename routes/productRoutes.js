import express from 'express'

const router = express.Router()
import {
  authenticateUser,
  unauthorizedPermissions,
} from "../middleware/authentication.js";

import { createProduct,
  getAllProducts,
  deleteProduct,
  getSingleProduct,
  updateProduct,
  uploadImage
} from '../controllers/productControllers.js'
  import { getSingleProductReviews, } from '../controllers/reviewControllers.js'


router 
  .route("/")
  .post(authenticateUser, unauthorizedPermissions('admin'), createProduct).get(getAllProducts)
router
  .route("/uploadImage")
  .post(authenticateUser, unauthorizedPermissions("admin"), uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .delete(authenticateUser, unauthorizedPermissions("admin"), deleteProduct)
  .patch(authenticateUser, unauthorizedPermissions("admin"), updateProduct);
  
router.route('/:id/reviews').get(getSingleProductReviews);

 
export default router; 