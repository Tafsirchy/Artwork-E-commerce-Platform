const express = require("express");
const router = express.Router();
const { createOrder, getOrderById, downloadInvoice, getOrders, updateOrderToDelivered, getMyOrders } = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/invoice").get(protect, downloadInvoice);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

module.exports = router;
