import React from "react";
import { ArrowLeft, Check, Coins, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useSelector } from "react-redux";
import { useState } from "react";

function Pricing() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 36, scale: 0.96 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.09,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const plans = [
    {
      name: "Free",
      description: "Perfect to explore GenWeb.ai",
      price: "₹0",
      suffix: "/one-time",
      credits: "100 Credits",
      features: ["AI website generation", "Responsive HTML output", "Basic animations"],
      button: "Get Started",
      buttonClass: "bg-[#2a2a2a] text-white hover:bg-[#353535]",
      accent: "from-transparent to-transparent",
    },
    {
      name: "Pro",
      description: "For serious creators & freelancers",
      price: "₹499",
      suffix: "/one-time",
      credits: "500 Credits",
      features: ["Everything in Free", "Faster generation", "Edit & regenerate"],
      button: "Upgrade to Pro",
      buttonClass: "bg-[#6f5cff] text-white hover:bg-[#5f4ef2]",
      accent: "from-[#6f5cff]/40 to-[#6f5cff]/10",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For teams & power users",
      price: "₹1499",
      suffix: "/one-time",
      credits: "1000 Credits",
      features: ["Unlimited iterations", "Highest priority", "Team collaboration", "Dedicated support"],
      button: "Contact Sales",
      buttonClass: "bg-[#4a4a4a] text-white hover:bg-[#5a5a5a]",
      accent: "from-white/5 to-white/0",
    },
  ];

  const handlePlanClick = async (planName) => {
    if (planName === "free") {
      navigate("/");
      return;
    }

    if (!userData) {
      navigate("/");
      return;
    }

    setLoadingPlan(planName);

    try {
      const result = await axios.post(
        `${serverUrl}/api/billing/checkout-session`,
        { plan: planName },
        { withCredentials: true }
      );

      setTimeout(() => {
        window.location.href = result.data.url;
      }, 700);
      
    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(103,58,183,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.2),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_30%)]" />

      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-16 max-w-4xl text-center"
        >
          <h1 className="text-4xl font-black tracking-tight md:text-6xl lg:text-7xl lg:whitespace-nowrap">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 text-base text-zinc-400 md:text-lg">
            Buy credits once. Build anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -10, scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              className={`group relative min-h-113.5 overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-b ${plan.accent} p-8 shadow-2xl shadow-black/40 backdrop-blur-sm transition-all duration-300 ${
                plan.popular ? "ring-1 ring-[#6f5cff]/50" : ""
              }`}
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                initial={false}
                animate={{
                  background:
                    plan.popular
                      ? "radial-gradient(circle at top left, rgba(111,92,255,0.32), transparent 45%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 40%)"
                      : "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 45%), radial-gradient(circle at bottom right, rgba(111,92,255,0.12), transparent 40%)",
                }}
              />

              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-12 top-0 h-24 blur-3xl"
                initial={{ opacity: 0.2, y: -20 }}
                animate={{ opacity: [0.2, 0.45, 0.2], y: [-20, -8, -20] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background:
                    plan.popular
                      ? "linear-gradient(90deg, rgba(111,92,255,0), rgba(111,92,255,0.35), rgba(255,255,255,0))"
                      : "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.12), rgba(255,255,255,0))",
                }}
              />

              {plan.popular ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.35 }}
                  className="absolute right-6 top-6 rounded-full bg-[#6f5cff] px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-[#6f5cff]/30"
                >
                  Most Popular
                </motion.div>
              ) : null}

              <div className="relative mb-8">
                <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-end gap-2">
                <div className="text-5xl font-black tracking-tight">{plan.price}</div>
                <div className="pb-1 text-sm text-zinc-400">{plan.suffix}</div>
              </div>

              <div className="mb-8 flex items-center gap-2 text-base font-semibold text-zinc-100">
                <Coins size={18} className="text-yellow-400" />
                {plan.credits}
              </div>

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <Check size={16} className="shrink-0 text-emerald-400" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => handlePlanClick(plan.name.toLowerCase())}
                disabled={loadingPlan !== null}
                className={`mt-10 w-full rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-80 ${plan.buttonClass}`}
              >
                {loadingPlan === plan.name.toLowerCase() ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Redirecting...
                  </span>
                ) : (
                  plan.button
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {loadingPlan ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.96, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="flex w-[min(92vw,420px)] flex-col items-center rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 text-center shadow-2xl shadow-black/60"
          >
            <div className="mb-5 rounded-full border border-white/10 bg-white/5 p-4">
              <Loader2 size={28} className="animate-spin text-white" />
            </div>
            <h2 className="text-2xl font-bold">Redirecting to checkout</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Please wait while we open Stripe for your {loadingPlan} plan.
            </p>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: "-30%" }}
                animate={{ x: "130%" }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2 rounded-full bg-linear-to-r from-[#6f5cff] via-white to-[#6f5cff]"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  );
}

export default Pricing;
