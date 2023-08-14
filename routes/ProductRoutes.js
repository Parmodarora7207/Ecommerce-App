import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  CreateProductController,
  UpdateProductController,
  braintreePaymentController,
  braintreeTokenController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFilterController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
} from "../controller/CreateProductController.js";
import formidable from "express-formidable";

const router = express.Router();

// routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  CreateProductController
);

// update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  UpdateProductController
);
// get all products
router.get("/get-product", getProductController);

// get single product
router.get("/get-product/:slug", getSingleProductController);

// get photo

router.get("/product-photo/:pid", productPhotoController);

// delete product
router.delete("/delete-product/:pid", deleteProductController);

// filter product
router.post("/product-filters", productFilterController);

// product Count
router.get("/product-count", productCountController);

// product per page
router.get("/product-list/:page", productListController);

//  Search Product
router.get("/search/:keyword", searchProductController);

// Similar Product
router.get("/related-product/:pid/:cid", relatedProductController);

// category wise product
router.get("/product-category/:slug", productCategoryController);

// payment routes
// token
router.get('/braintree/token',braintreeTokenController)

// payments
router.post('/braintree/payment',requireSignIn,braintreePaymentController)

export default router;
