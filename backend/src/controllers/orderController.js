const Order = require("../models/Order");
const Cart = require("../models/Cart");
const stripe = require("../config/stripe");
const { sendOrderConfirmationEmail } = require("../services/mailService");
const path = require("path");
const fs = require("fs");

// @desc    Create new order and create Stripe PaymentIntent
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Clear the user's cart after creating the order
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } }
      );

      // If Card, create a payment intent
      if (paymentMethod === "Card") {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalPrice * 100), // convert to cents
          currency: "usd",
          metadata: { orderId: createdOrder._id.toString() },
        });

        res.status(201).json({
          order: createdOrder,
          clientSecret: paymentIntent.client_secret,
        });
      } else {
        // Cash on delivery
        await createdOrder.populate("user", "email");
        await sendOrderConfirmationEmail(createdOrder, createdOrder.user.email);
        res.status(201).json({ order: createdOrder });
      }
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (order && (order.user._id.toString() === req.user._id.toString() || req.user.role === "admin")) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found or unauthorized");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Download invoice PDF
// @route   GET /api/orders/:id/invoice
// @access  Private
const downloadInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(401);
      throw new Error("Not authorized");
    }
    
    const invoicePath = path.join(__dirname, "../../invoices", `invoice-${order._id}.pdf`);
    
    if (fs.existsSync(invoicePath)) {
      res.download(invoicePath);
    } else {
      res.status(404);
      throw new Error("Invoice file not found. It might not be generated yet.");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/orders/webhook
// @access  Public
const stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
       event = stripe.webhooks.constructEvent(
         req.body, // Requires raw body parser setup in Express
         sig,
         process.env.STRIPE_WEBHOOK_SECRET
       );
    } else {
       // Only for development without webhook secret configured
       event = JSON.parse(req.body.toString());
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      const order = await Order.findById(orderId).populate("user", "email");
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: paymentIntent.receipt_email,
        };
        await order.save();
        
        // Send email with invoice
        await sendOrderConfirmationEmail(order, order.user.email);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrderById, downloadInvoice, stripeWebhook, getOrders, updateOrderToDelivered, getMyOrders };
