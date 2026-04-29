const Stripe = require("stripe");
// Fallback to a dummy key if not present in env to prevent crashes
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");
module.exports = stripe;
