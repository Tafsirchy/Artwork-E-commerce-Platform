const express = require("express");
const router = express.Router();
const { getConfig, updateConfig } = require("../controllers/homeConfigController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").post(protect, admin, updateConfig);
router.route("/:section").get(getConfig);

module.exports = router;
