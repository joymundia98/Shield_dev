import express from "express";
import {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
} from "./donationController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", verifyJWT, getAllDonations);
router.get("/:id", verifyJWT, getDonationById);
router.post("/", verifyJWT, createDonation);
router.patch("/:id", verifyJWT,  updateDonation);
router.delete("/:id", verifyJWT, deleteDonation);

export default router;
