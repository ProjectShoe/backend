const express = require("express");
const router = express.Router();
const LeaveRequestController = require("../controllers/leaveRequest.controller");
const { verifyToken, verifyTokenAndAdmin } = require("../middleware/authMiddleware");

// Submit leave request
router.post("/addLeaveRequest", verifyToken, LeaveRequestController.addLeaveRequest);

// Update leave request (e.g., approve/reject)
router.put("/:id", verifyTokenAndAdmin, LeaveRequestController.updateLeaveRequest);

// Get leave requests for a specific user
router.get("/myLeaveRequests", verifyToken, LeaveRequestController.getLeaveRequestsByUser);

// Get all leave requests (admin only)
router.get("/allLeaveRequests", verifyTokenAndAdmin, LeaveRequestController.getAllLeaveRequests);

module.exports = router;
