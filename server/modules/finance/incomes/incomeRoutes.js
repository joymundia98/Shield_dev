// modules/finance/incomes/incomeRoutes.js
import express from 'express';
import IncomeController from './incomeController.js';

const router = express.Router({ mergeParams: true }); // mergeParams to access orgId from parent router

// Get all incomes for org
router.get('/', IncomeController.list);

router.get('/:id', IncomeController.getById);

router.post('/', IncomeController.create);

router.patch('/:id', IncomeController.update);

router.patch('/:id/status', IncomeController.updateStatus);

router.delete('/:id', IncomeController.delete);

export default router;
