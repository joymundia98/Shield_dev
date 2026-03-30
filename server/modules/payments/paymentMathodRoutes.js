import express from "express";
import { PaymentMethodController } from "./paymentMethodsController.js";

const router = express.Router();

router.post("/", PaymentMethodController.create);
router.get("/", PaymentMethodController.getAll);
router.get("/:id", PaymentMethodController.getById);
router.put("/:id", PaymentMethodController.update);
router.delete("/:id", PaymentMethodController.delete);

export default router;