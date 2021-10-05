import express from 'express'

import {
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllProducts,
  fetchProductById,
} from '../../controllers/private/productController.js'

import { admin, protect } from '../../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, fetchAllProducts)

router.get('/:id', protect, admin, fetchProductById)

router.route('/add-review/:id').post(protect, createProductReview)

router.route('/create-product').post(protect, admin, createProduct)

router.route('/update-product/:id').put(protect, admin, updateProduct)

router.route('/delete-product/:id').delete(protect, admin, deleteProduct)

export default router
