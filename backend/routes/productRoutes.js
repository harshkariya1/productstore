const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts} = productController;
const verifyToken = require('../config/auth');
const authMiddleware = require('../middlewares/authMiddleware');
const fileHandleMiddleware = require('../middlewares/fileHandleMiddleware');

// Create a new product
router.post('/createProducts', createProduct);

// Get all products
router.get('/products', getAllProducts);

// Get a specific product by ID
router.get('/productById/:id', getProductById);

// Update a product 
router.put('/updateProduct/:productId', authMiddleware, fileHandleMiddleware.array("images", 5), updateProduct);


// Delete a product
router.delete('/deleteProducts/:id', deleteProduct);

// Search products
router.get('/search', searchProducts);

module.exports = router;
