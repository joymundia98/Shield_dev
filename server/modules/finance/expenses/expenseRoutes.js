// modules/finance/expenses/expenseRoutes.js
import express from 'express';
import ExpenseController from './expenseController.js';

const router = express.Router();

router.get('/', ExpenseController.list);
router.get('/:id', ExpenseController.getById);
router.post('/', ExpenseController.create);
router.put('/:id', ExpenseController.update);
router.patch("/:id/status", ExpenseController.updateStatus);
router.delete('/:id', ExpenseController.delete);

export default router;
