const Stripe = require("stripe");
const { config } = require("../config");

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: "2025-05-28.basil",
});

exports.stripe = stripe;
