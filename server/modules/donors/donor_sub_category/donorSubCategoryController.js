import DonorSubcategory from "./donorSubCategory.js";

export const getAllSubcategories = async (req, res) => {
  try {
    const subcats = await DonorSubcategory.getAll();
    res.json(subcats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};

export const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcat = await DonorSubcategory.getById(id);
    if (!subcat) return res.status(404).json({ error: "Subcategory not found" });
    res.json(subcat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subcategory" });
  }
};

export const createSubcategory = async (req, res) => {
  try {
    const { donor_type_id, name } = req.body;
    const newSubcat = await DonorSubcategory.create({ donor_type_id, name });
    res.status(201).json(newSubcat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create subcategory" });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedSubcat = await DonorSubcategory.update(id, { name });
    if (!updatedSubcat) return res.status(404).json({ error: "Subcategory not found" });
    res.json(updatedSubcat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update subcategory" });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubcat = await DonorSubcategory.delete(id);
    if (!deletedSubcat) return res.status(404).json({ error: "Subcategory not found" });
    res.json(deletedSubcat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete subcategory" });
  }
};
