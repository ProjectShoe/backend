const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/employeeController");
const upload = require("../middleware/upload");

const {
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

//AddUser
router.post(
  "/addUser",
  verifyTokenAndAdmin,
  upload.single("image"),
  EmployeeController.addUser
);
//UpdateUser
router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  EmployeeController.UpdateUser
);
//Delete
router.delete(
  "/deleteUser/:id",
  verifyTokenAndAdmin,
  EmployeeController.deleteUser
);
//GetUser
router.get("/getUser/:id", verifyToken, EmployeeController.getUser);
//GetTotalAllUser
router.get("/getTotalAllUser", EmployeeController.getTotalAllUser);
//GetTotalStatusUser
router.get("/getTotalStatusUser", EmployeeController.getTotalStatusUser);
//GetTotalUnStatusUser
router.get("/getTotalUnStatusUser", EmployeeController.getTotalUnStatusUser);
//GetTotalNewUser
router.get("/getNewUser", EmployeeController.getTotalNewUser);
//GetAllUser
router.get("/getAllUser", verifyTokenAndAdmin, EmployeeController.getAllUser);

module.exports = router;
