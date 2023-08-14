import express from "express";
import {
  registerController,
  LoginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// routes
const router = express.Router();

// routing
// REGISTER||METHOD POST
router.post("/register", registerController);
//  LOGIN||POST
router.post("/Login", LoginController);

// Forgot Password||POST
router.post("/forgot-password", forgotPasswordController);
// test route
router.get("/test", requireSignIn, isAdmin, testController);

// protected user route auth
router.get("/user-Auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
// protected admin route auth
router.get("/admin-Auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update profile
router.put("/profile", requireSignIn, updateProfileController);

// orders
router.get("/orders", requireSignIn, getOrdersController);
// All orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
