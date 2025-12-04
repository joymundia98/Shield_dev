import Donation from "./donationModel.js";

// GET all donations
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.getAll();
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching donations" });
  }
};

// GET donation by ID
export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.getById(req.params.id);
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    res.json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching donation" });
  }
};

// POST create donation
export const createDonation = async (req, res) => {
  try {
    const newDonation = await Donation.create(req.body);
    res.status(201).json(newDonation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating donation" });
  }
};

// PUT update donation
export const updateDonation = async (req, res) => {
  try {
    const updatedDonation = await Donation.update(req.params.id, req.body);
    if (!updatedDonation) return res.status(404).json({ error: "Donation not found" });
    res.json(updatedDonation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating donation" });
  }
};

// DELETE donation
export const deleteDonation = async (req, res) => {
  try {
    const deletedDonation = await Donation.delete(req.params.id);
    if (!deletedDonation) return res.status(404).json({ error: "Donation not found" });
    res.json({ message: "Donation deleted successfully", deletedDonation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while deleting donation" });
  }
};
