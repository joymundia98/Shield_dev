// modules/finance/expenseCategories/expenseCategoryRoutes.js
import express from 'express';
import ExpenseCategoryController from './expenseCategoryController.js';

const router = express.Router();

router.get('/', ExpenseCategoryController.list);
router.get('/:id', ExpenseCategoryController.getById);
router.post('/', ExpenseCategoryController.create);
router.patch('/:id', ExpenseCategoryController.update);
router.delete('/:id', ExpenseCategoryController.delete);

export default router;
