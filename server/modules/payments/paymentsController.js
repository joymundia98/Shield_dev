import { Payment } from "./payment.js";
import { Subscription } from "../subscriptions/subscriptions.js";

export const PaymentController = {
  /**
   * STEP 1: Initiate Payment
   * - Creates subscription
   * - Creates polymorphic payment
   */
  async initiatePayment(req, res) {
    try {
      const user_id = req.auth.sub;

      const {
        plan_id,
        amount,
        payment_provider,
        payment_method_id,
        reference_id,
        organization_id,
        date,
        remarks,
        billing_cycle
      } = req.body;

      // ✅ ALWAYS from auth context (secure multi-tenant)
      // const organization_id = req.auth.organization_id;
      const headquarters_id = req.auth.headquarters_id;

      // 1. Create subscription (inactive/pending)
      const subscription = await Subscription.create({
        user_id,
        plan_id,
        organization_id,
        headquarters_id,
        remarks,
        billing_cycle
      });

      // 2. Create payment (polymorphic link)
      const payment = await Payment.create({
        user_id,
        organization_id,
        headquarters_id,
        amount,
        payment_provider: payment_provider || "cash",
        date,
        payment_method_id,
        remarks,
        payment_date: subscription.created_at,
        reference_type: "subscription",
        reference_id,
        subscription_id: subscription.id,
        plan_id,
        billing_cycle,
      });

      return res.status(201).json({
        message: "Payment initiated",
        subscription,
        payment,
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * STEP 2: Confirm Payment (Webhook / callback)
   */
  async confirmPayment(req, res) {
    try {
      const { provider_payment_id } = req.body;

      const payment = await Payment.markCompleted(provider_payment_id);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      // Handle polymorphic reference
      switch (payment.reference_type) {
        case "subscription":
          await Subscription.activate(payment.reference_id);
          break;

        case "invoice":
          // await Invoice.markPaid(payment.reference_id);
          break;

        case "order":
          // await Order.markPaid(payment.reference_id);
          break;

        default:
          console.warn(
            "Unknown payment reference type:",
            payment.reference_type
          );
      }

      return res.json({
        message: "Payment successful",
        payment,
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * STEP 3: Handle Failed Payment
   */
  async failPayment(req, res) {
    try {
      const { provider_payment_id } = req.body;

      const payment = await Payment.markFailed(provider_payment_id);

      return res.json({
        message: "Payment failed",
        payment,
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * Get user payments
   */
  async getMyPayments(req, res) {
    try {
      const payments = await Payment.getByUser(req.auth.sub);
      return res.json(payments);

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

   async getPayments(req, res) {
    try {
      const payments = await Payment.getAll();
      return res.json(payments);

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * Get single payment
   */
  async getPaymentById(req, res) {
    try {
      const payment = await Payment.getById(req.params.id);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      return res.json(payment);

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};