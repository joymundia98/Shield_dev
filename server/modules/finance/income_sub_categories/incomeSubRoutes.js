// modules/finance/incomeSubcategories/incomeSubcategoryRoutes.js
import express from 'express';
import IncomeSubcategoryController from './incomeSubController.js';

const router = express.Router();

router.get('/', IncomeSubcategoryController.list);
router.get('/:id', IncomeSubcategoryController.getById);
router.post('/', IncomeSubcategoryController.create);
router.put('/:id', IncomeSubcategoryController.update);
router.delete('/:id', IncomeSubcategoryController.delete);

export default router;
