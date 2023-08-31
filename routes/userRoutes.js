import express from "express";
const router = express.Router();

import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userControllers.js";

import {
  authenticateUser,
  unauthorizedPermissions,
} from "../middleware/authentication.js";


router.route("/").get(authenticateUser, unauthorizedPermissions('admin'), getAllUsers);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword); 
router.route("/:id").get(authenticateUser, getSingleUser);


export default router;