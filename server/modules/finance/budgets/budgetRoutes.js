// modules/finance/budgets/budgetRoutes.js
import express from 'express';
import BudgetController from './budgetController.js';

const router = express.Router();

router.get('/', BudgetController.list);
router.get('/:id', BudgetController.getById);
router.post('/', BudgetController.create);
router.put('/:id', BudgetController.update);
router.delete('/:id', BudgetController.delete);

export default router;
