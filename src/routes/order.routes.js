const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

// AddOrder
router.post("/addOrder", verifyToken, OrderController.addOrder);

// UpdateOrder
router.put("/:id", verifyToken, OrderController.updateOrder);

// DeleteOrder
router.delete("/:id", verifyTokenAndAdmin, OrderController.deleteOrder);

// GetOrder
router.get("/:id", verifyToken, OrderController.getOrder);

// GetAllOrders
router.get("/", verifyToken, OrderController.getAllOrders);

module.exports = router;
