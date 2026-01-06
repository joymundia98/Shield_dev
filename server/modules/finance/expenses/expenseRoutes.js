// modules/finance/expenses/expenseRoutes.js
import express from 'express';
import ExpenseController from './expenseController.js';

const router = express.Router();

// Get all expenses for a specific organization (query param optional for list)
router.get('/', ExpenseController.list);

// Get all expenses for an organization via orgId param
router.get('/organization/:orgId', ExpenseController.getByOrganization);

// Get a specific expense by ID
router.get('/:id', ExpenseController.getById);

// Create a new expense (requires organization_id in body)
router.post('/', ExpenseController.create);

// Update an expense (requires organization_id in body)
router.put('/:id', ExpenseController.update);

// Update the status of an expense
router.patch('/:id/status', ExpenseController.updateStatus);

// Delete an expense
router.delete('/:id', ExpenseController.delete);

export default router;
