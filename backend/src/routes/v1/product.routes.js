const express = require('express');
const productController = require('../../controllers/product.controller');
const priceHistoryController = require('../../controllers/priceHistory.controller');
const validateRequest = require('../../middleware/validateRequest');
const ProductDTO = require('../../dto/product.dto');

const router = express.Router();

router.post('/', validateRequest(ProductDTO.validateCreate), (req, res, next) => productController.createProduct(req, res, next));
router.get('/', (req, res, next) => productController.getProducts(req, res, next));
router.get('/:id', (req, res, next) => productController.getProductById(req, res, next));
router.patch('/:id', validateRequest(ProductDTO.validateUpdate), (req, res, next) => productController.updateProduct(req, res, next));
router.delete('/:id', (req, res, next) => productController.deleteProduct(req, res, next));

router.post('/:id/monitor', (req, res, next) => productController.monitorProduct(req, res, next));
router.post('/:id/extract', (req, res, next) => productController.extractProduct(req, res, next));
router.post('/:id/replay', (req, res, next) => productController.replayProduct(req, res, next));
router.get('/:id/history', (req, res, next) => productController.getProductHistory(req, res, next));

router.get('/:id/prices', (req, res, next) => priceHistoryController.getProductPrices(req, res, next));
router.get('/:id/statistics', (req, res, next) => priceHistoryController.getProductStatistics(req, res, next));

module.exports = router;
