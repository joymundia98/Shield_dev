import DonorType from "./donorTypeModel.js";

export const getAllDonorTypes = async (req, res) => {
  try {
    const types = await DonorType.getAll();
    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch donor types" });
  }
};

export const getDonorTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const type = await DonorType.getById(id);
    if (!type) return res.status(404).json({ error: "Donor type not found" });
    res.json(type);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch donor type" });
  }
};

export const createDonorType = async (req, res) => {
  try {
    const { name } = req.body;
    const newType = await DonorType.create({ name });
    res.status(201).json(newType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create donor type" });
  }
};

export const updateDonorType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedType = await DonorType.update(id, { name });
    if (!updatedType) return res.status(404).json({ error: "Donor type not found" });
    res.json(updatedType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update donor type" });
  }
};

export const deleteDonorType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedType = await DonorType.delete(id);
    if (!deletedType) return res.status(404).json({ error: "Donor type not found" });
    res.json(deletedType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete donor type" });
  }
};
