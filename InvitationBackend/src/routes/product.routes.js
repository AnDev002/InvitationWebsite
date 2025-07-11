const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware'); 
const { validateProduct } = require('../utils/validators');
const { upload, resizeImage, uploadImageToR2 } = require('../middleware/upload.middleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, upload.single('image'), validateProduct, resizeImage, uploadImageToR2, productController.createProduct);
router.put('/:id', protect, validateProduct, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;