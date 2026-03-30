import { PaymentMethod } from "./paymentMethods.js";

export const PaymentMethodController = {

  async create(req, res) {
    try {
      const { name, provider } = req.body;

      const method = await PaymentMethod.create({ name, provider });

      return res.status(201).json(method);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const methods = await PaymentMethod.getAll();
      return res.json(methods);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const method = await PaymentMethod.getById(req.params.id);

      if (!method) {
        return res.status(404).json({ error: "Not found" });
      }

      return res.json(method);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await PaymentMethod.update(
        req.params.id,
        req.body
      );

      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await PaymentMethod.delete(req.params.id);

      return res.json({ message: "Deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};