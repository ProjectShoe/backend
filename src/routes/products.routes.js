const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const {
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");
const { route } = require("./employee.routes");
const upload = require("../middleware/upload");

//AddProduct
router.post(
  "/addProduct",
  upload.single("image"),
  verifyTokenAndAdmin,
  ProductController.addProduct
);
//UpdateProduct
router.put(
  "/:id",
  verifyTokenAndAdmin,
  upload.single("image"),
  ProductController.UpdateProduct
);
//DeleteProduct
router.delete(
  "/deleteProduct/:id",
  verifyTokenAndAdmin,
  ProductController.deleteProduct
);
//GetProduct
router.get("/getProduct/:id", verifyToken, ProductController.getProduct);
//GetAllProduct
router.get("/getAllProduct", verifyToken, ProductController.getAllProduct);
module.exports = router;
