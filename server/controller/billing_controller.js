const stripe = require("../config/stripe");
const User = require("../model/user_model");
const { PLANS } = require("../config/plan");

const createCheckoutSession = async (req, res) => {
    try {
        const { plan } = req.body;

        if (!plan || !PLANS[plan] || plan === "free") {
            return res.status(400).json({ error: "Invalid plan" });
        }

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const selectedPlan = PLANS[plan];
        const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: req.user.email,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${plan.toUpperCase()} Plan`,
                            description: `${selectedPlan.credits} credits for GenWeb.ai`,
                        },
                        unit_amount: selectedPlan.price * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: String(req.user._id),
                plan: selectedPlan.plan,
                credits: String(selectedPlan.credits),
            },
            success_url: `${frontendUrl}`,
            cancel_url: `${frontendUrl}/pricing?canceled=1`,
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to create checkout session" });
    }
};

const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const { userId, plan, credits } = session.metadata || {};

            if (userId && plan && credits) {
                const user = await User.findById(userId);

                if (user && user.lastStripeSessionId !== session.id) {
                    user.credits += Number(credits);
                    user.plan = plan;
                    user.lastStripeSessionId = session.id;
                    await user.save();
                }
            }
        }

        return res.json({ received: true });
    } catch (error) {
        console.log(error);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

module.exports = { createCheckoutSession, stripeWebhook };
