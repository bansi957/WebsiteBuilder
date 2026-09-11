const express = require("express");
const auth_middleware = require("../middleware/auth_middleware");
const { createCheckoutSession } = require("../controller/billing_controller");

const billingRouter = express.Router();

billingRouter.post("/checkout-session", auth_middleware, createCheckoutSession);

module.exports = billingRouter;