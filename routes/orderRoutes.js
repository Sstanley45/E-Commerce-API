import express from "express";

const router = express.Router();
import {
  authenticateUser,
  unauthorizedPermissions,
} from "../middleware/authentication.js";
import {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} from "../controllers/orderControllers.js";

router
  .route("/")
  .get(authenticateUser, unauthorizedPermissions("admin"), getAllOrders)
  .post(authenticateUser, createOrder);
router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);
router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);


export default router;  