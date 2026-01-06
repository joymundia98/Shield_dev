import Donation from "./donationModel.js";

// GET all donations (by organization)
export const getAllDonations = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const donations = await Donation.getAll(organization_id);
    return res.json(donations);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error while fetching donations",
    });
  }
};

// GET donation by ID (org scoped)
export const getDonationById = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const { id } = req.params;

    const donation = await Donation.getById(id, organization_id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    return res.json(donation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error while fetching donation",
    });
  }
};

// POST create donation (org enforced)
export const createDonation = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const newDonation = await Donation.create({
      ...req.body,
      organization_id,
    });

    return res.status(201).json(newDonation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error while creating donation",
    });
  }
};

// PUT update donation (org scoped)
export const updateDonation = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const { id } = req.params;

    const updatedDonation = await Donation.update(
      id,
      organization_id,
      req.body
    );

    if (!updatedDonation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    return res.json(updatedDonation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error while updating donation",
    });
  }
};

// DELETE donation (org scoped)
export const deleteDonation = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const { id } = req.params;

    const deletedDonation = await Donation.delete(id, organization_id);
    if (!deletedDonation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    return res.json({
      message: "Donation deleted successfully",
      deletedDonation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error while deleting donation",
    });
  }
};
