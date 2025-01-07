const express = require("express");
const router = express.Router();
const TimecardController = require("../controllers/timeCardController.js");
const {
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

router.post("/addTimecard", verifyToken, TimecardController.addTimecard);

router.put("/:id", verifyTokenAndAdmin, TimecardController.updateTimecard);

router.delete(
  "/deleteTimecard/:id",
  verifyTokenAndAdmin,
  TimecardController.deleteTimecard
);

router.get("/getTimecard/:id", verifyToken, TimecardController.getTimecard);

router.get("/getAllTimecards", verifyToken, TimecardController.getAllTimecards);

module.exports = router;
