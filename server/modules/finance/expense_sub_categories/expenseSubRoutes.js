// modules/finance/expenseSubcategories/expenseSubcategoryRoutes.js
import express from 'express';
import ExpenseSubcategoryController from './expenseSubController.js';

const router = express.Router();

router.get('/', ExpenseSubcategoryController.list);
router.get('/:id', ExpenseSubcategoryController.getById);
router.post('/', ExpenseSubcategoryController.create);
router.put('/:id', ExpenseSubcategoryController.update);
router.delete('/:id', ExpenseSubcategoryController.delete);

export default router;
