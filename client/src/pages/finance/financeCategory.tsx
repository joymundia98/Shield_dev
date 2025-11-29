import React, { useState } from "react";
import "../../styles/global.css";

interface Category {
  name: string;
  subcategories?: string[];
}

interface PaymentMethod {
  name: string;
}

type GroupType = "income" | "expense" | "payment";

const FinanceCategories: React.FC = () => {
  // Data state
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([
    { name: "Tithes & Offerings", subcategories: ["Tithes", "Offerings", "Digital Giving"] },
  ]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([
    { name: "Operational Expenses", subcategories: ["Rent", "Utilities", "Office Supplies"] },
  ]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { name: "Cash" },
    { name: "Credit Card" },
    { name: "Bank Transfer" },
  ]);

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupType | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);

  // Open popup for add/edit
  const openPopup = (group: GroupType, index: number | null = null) => {
    setEditingGroup(group);
    setEditIndex(index);
    if (index !== null) {
      if (group === "income") {
        setCategoryName(incomeCategories[index].name);
        setSubcategories([...incomeCategories[index].subcategories!]);
      } else if (group === "expense") {
        setCategoryName(expenseCategories[index].name);
        setSubcategories([...expenseCategories[index].subcategories!]);
      } else if (group === "payment") {
        setCategoryName(paymentMethods[index].name);
        setSubcategories([]);
      }
    } else {
      setCategoryName("");
      setSubcategories([]);
    }
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setCategoryName("");
    setSubcategories([]);
    setEditIndex(null);
    setEditingGroup(null);
  };

  // Add/Delete subcategory field
  const addSubcategory = (name?: string) => setSubcategories([...subcategories, name || ""]);
  const deleteSubcategory = (index: number) => setSubcategories(subcategories.filter((_, i) => i !== index));
  const updateSubcategory = (index: number, value: string) => {
    const updated = [...subcategories];
    updated[index] = value;
    setSubcategories(updated);
  };

  // Save category/payment
  const saveItem = () => {
    if (!categoryName.trim()) {
      alert("Name is required");
      return;
    }
    if ((editingGroup === "income" || editingGroup === "expense") && subcategories.length === 0) {
      alert("Add at least one subcategory");
      return;
    }

    if (editingGroup === "income") {
      const updated = [...incomeCategories];
      if (editIndex !== null) updated[editIndex] = { name: categoryName, subcategories };
      else updated.push({ name: categoryName, subcategories });
      setIncomeCategories(updated);
    } else if (editingGroup === "expense") {
      const updated = [...expenseCategories];
      if (editIndex !== null) updated[editIndex] = { name: categoryName, subcategories };
      else updated.push({ name: categoryName, subcategories });
      setExpenseCategories(updated);
    } else if (editingGroup === "payment") {
      const updated = [...paymentMethods];
      if (editIndex !== null) updated[editIndex] = { name: categoryName };
      else updated.push({ name: categoryName });
      setPaymentMethods(updated);
    }
    closePopup();
  };

  // Delete item
  const deleteItem = (group: GroupType, index: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    if (group === "income") setIncomeCategories(incomeCategories.filter((_, i) => i !== index));
    if (group === "expense") setExpenseCategories(expenseCategories.filter((_, i) => i !== index));
    if (group === "payment") setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  // Render table rows
  const renderCategoryRows = (group: GroupType, data: Category[] | PaymentMethod[]) =>
    data.map((item, idx) => (
      <tr key={idx}>
        <td>{item.name}</td>
        {group !== "payment" && <td>{(item as Category).subcategories?.join(", ")}</td>}
        <td>
          <button className="edit-btn" onClick={() => openPopup(group, idx)}>Edit</button>
          <button className="delete-btn" onClick={() => deleteItem(group, idx)}>Delete</button>
        </td>
      </tr>
    ));

  return (
    <div className="container">
      {/* Income Categories */}
      <div className="table-section">
        <div className="table-header">
          <h2>Income Categories</h2>
          <button className="add-btn" onClick={() => openPopup("income")}>+ Add Income Category</button>
        </div>
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Subcategories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderCategoryRows("income", incomeCategories)}</tbody>
        </table>
      </div>

      {/* Expense Categories */}
      <div className="table-section">
        <div className="table-header">
          <h2>Expense Categories</h2>
          <button className="add-btn" onClick={() => openPopup("expense")}>+ Add Expense Category</button>
        </div>
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Subcategories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderCategoryRows("expense", expenseCategories)}</tbody>
        </table>
      </div>

      {/* Payment Methods */}
      <div className="table-section">
        <div className="table-header">
          <h2>Payment Methods</h2>
          <button className="add-btn" onClick={() => openPopup("payment")}>+ Add Payment Method</button>
        </div>
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Method Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderCategoryRows("payment", paymentMethods)}</tbody>
        </table>
      </div>

      {/* Popup Form */}
      {popupOpen && (
        <>
          <div className="overlay" onClick={closePopup}></div>
          <div className="filter-popup">
            <h3>{editIndex === null ? "Add " : "Edit "} 
              {editingGroup === "income" ? "Income Category" : editingGroup === "expense" ? "Expense Category" : "Payment Method"}
            </h3>
            <div className="popup-content">
              <label>Name</label>
              <input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} />

              {(editingGroup === "income" || editingGroup === "expense") && (
                <>
                  <label>Subcategories</label>
                  {subcategories.map((sub, idx) => (
                    <div className="subcategory-row" key={idx}>
                      <input type="text" value={sub} onChange={e => updateSubcategory(idx, e.target.value)} />
                      <button type="button" onClick={() => deleteSubcategory(idx)}>Delete</button>
                    </div>
                  ))}
                  <div className="subcategory-row">
                    <input type="text" placeholder="New subcategory" value="" onChange={() => {}} />
                    <button type="button" onClick={() => addSubcategory()}>Add</button>
                  </div>
                  <button type="button" onClick={() => addSubcategory()}>+ Add another subcategory field</button>
                </>
              )}
            </div>
            <div className="filter-popup-buttons">
              <button className="add-btn" onClick={saveItem}>Save</button>
              <button className="cancel-btn" onClick={closePopup}>Cancel</button>
              {editIndex !== null && <button className="delete-btn" onClick={() => { deleteItem(editingGroup!, editIndex); closePopup(); }}>Delete</button>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceCategories;
