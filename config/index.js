require("dotenv").config();

exports.config = {
  APP_NAME: process.env.APP_NAME || "Migonest",

  clientUrl: process.env.clientUrl,
  databaseUrl: process.env.databaseUrl,
  port: process.env.port,
  jwtPrivateKey: process.env.jwtPrivateKey,
  cloudinaryCloudName: process.env.cloudinary_cloud_name,
  cloudinaryApiKey: process.env.cloudinary_api_key,
  cloudinaryApiSecret: process.env.cloudinary_api_secret,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeMonthlyPriceId: process.env.STRIPE_MONTHLY_PRICE_ID,
  // stripeYearlyPriceId: process.env.STRIPE_YEARLY_PRICE_ID,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};
