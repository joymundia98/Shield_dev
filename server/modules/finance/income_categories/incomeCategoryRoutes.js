// modules/finance/incomeCategories/incomeCategoryRoutes.js
import express from 'express';
import IncomeCategoryController from './incomeCategoryController.js';

const router = express.Router();

router.get('/', IncomeCategoryController.list);
router.get('/:id', IncomeCategoryController.getById);
router.post('/', IncomeCategoryController.create);
router.put('/:id', IncomeCategoryController.update);
router.delete('/:id', IncomeCategoryController.delete);

export default router;
