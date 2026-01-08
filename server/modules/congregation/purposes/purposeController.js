import Purpose from "./purposeModel.js";

// GET all purposes
export const getAllPurposes = async (req, res) => {
  try {
    const purposes = await Purpose.getAll(req.auth.organization_id);
    res.json(purposes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching purposes" });
  }
};

// GET purpose by ID
export const getPurposeById = async (req, res) => {
  try {
    const purpose = await Purpose.getById(req.params.id, req.auth.organization_id);
    if (!purpose) return res.status(404).json({ error: "Purpose not found" });
    res.json(purpose);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching purpose" });
  }
};

// POST create purpose
export const createPurpose = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const newPurpose = await Purpose.create({ name }, req.auth.organization_id);
    res.status(201).json(newPurpose);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating purpose" });
  }
};

// PUT update purpose
export const updatePurpose = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedPurpose = await Purpose.update(
      req.params.id,
      { name },
      req.auth.organization_id
    );

    if (!updatedPurpose) return res.status(404).json({ error: "Purpose not found" });
    res.json(updatedPurpose);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating purpose" });
  }
};

// DELETE purpose
export const deletePurpose = async (req, res) => {
  try {
    const deletedPurpose = await Purpose.delete(req.params.id, req.auth.organization_id);
    if (!deletedPurpose) return res.status(404).json({ error: "Purpose not found" });
    res.json({ message: "Purpose deleted successfully", deletedPurpose });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while deleting purpose" });
  }
};
