const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerController.js");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

// Add a new customer
router.post("/addCustomer", verifyToken, CustomerController.addCustomer);

// Update an existing customer
router.put("/:id", verifyTokenAndAdmin, CustomerController.updateCustomer);

// Delete a customer
router.delete("/:id", verifyTokenAndAdmin, CustomerController.deleteCustomer);

// Get a single customer
router.get("/:id", verifyToken, CustomerController.getCustomer);

// Get all customers
router.get("/", verifyToken, CustomerController.getAllCustomers);

module.exports = router;
