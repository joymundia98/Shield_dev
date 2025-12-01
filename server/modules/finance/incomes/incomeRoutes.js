// modules/finance/incomes/incomeRoutes.js
import express from 'express';
import IncomeController from './incomeController.js';

const router = express.Router();

router.get('/', IncomeController.list);
router.get('/:id', IncomeController.getById);
router.post('/', IncomeController.create);
router.put('/:id', IncomeController.update);
router.delete('/:id', IncomeController.delete);

export default router;
