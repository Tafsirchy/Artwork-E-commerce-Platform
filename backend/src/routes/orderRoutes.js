const express = require("express");
const router = express.Router();
const { createOrder, getOrderById, downloadInvoice, getOrders } = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/invoice").get(protect, downloadInvoice);

module.exports = router;
