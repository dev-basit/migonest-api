const { config } = require("../config");
const { stripe } = require("../utils");

const createBillingPortalSession = async (stripeCustomerId) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${config.clientUrl}/billing`,
    });
    return session;
  } catch (error) {
    throw new Error(`Error creating billing portal session: ${error.message}`);
  }
};

const createUniExpertServiceSession = async (student, uniExpertRequestId) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: student.stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Consultation Fee",
              // images: [course.imageUrl],
            },
            unit_amount: Math.round(500 * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // success_url: `${config.clientUrl}/courses/${1}/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${config.clientUrl}/dashboard/admission`,
      cancel_url: `${config.clientUrl}/dashboard/admission`,
      metadata: {
        userId: student._id.toString(),
        uniExpertRequestId,
      },
    });
    return session;
  } catch (error) {
    throw new Error(`Error creating uni expert service session: ${error.message}`);
  }
};

const createSubscriptionSession = async (user, planDuration) => {
  try {
    let priceIdForSubscriptionPlan;
    if (planDuration === "month") {
      priceIdForSubscriptionPlan = config.stripeMonthlyPriceId;
    } else if (planDuration === "year") {
      priceIdForSubscriptionPlan = config.stripeYearlyPriceId;
    }

    if (!priceIdForSubscriptionPlan) {
      throw new Error("Invalid plan duration or price ID not configured");
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      line_items: [{ price: priceIdForSubscriptionPlan, quantity: 1 }],
      mode: "subscription",
      // success_url: `${config.clientUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${config.clientUrl}/dashboard/profile`,
      cancel_url: `${config.clientUrl}/dashboard/profile`,
      metadata: {
        userId: user._id.toString(),
        email: user.email,
        planDuration: planDuration,
      },
    });
    return session;
  } catch (error) {
    throw new Error(`Error creating subscription session: ${error.message}`);
  }
};

exports.checkoutService = {
  createBillingPortalSession,
  createUniExpertServiceSession,
  createSubscriptionSession,
};
