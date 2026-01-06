// modules/finance/incomeSubcategories/incomeSubcategoryRoutes.js
import express from 'express';
import IncomeSubcategoryController from './incomeSubController.js';

const router = express.Router();

router.get('/:orgId', IncomeSubcategoryController.list);

router.get('/:orgId/:id', IncomeSubcategoryController.getById);

router.post('/', IncomeSubcategoryController.create);

router.put('/:orgId/:id', IncomeSubcategoryController.update);

router.delete('/:orgId/:id', IncomeSubcategoryController.delete);

export default router;
