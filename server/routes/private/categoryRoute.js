import express from 'express'

// * Controller
import {
  createCategory,
  fetchAllCategory,
  fetchCategoryById,
  updateCategory,
} from '../../controllers/private/categoryController.js'

// * Middleware
import { admin, protect } from '../../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, admin, fetchAllCategory)

router.route('/create-category').post(protect, admin, createCategory)

router.route('/update-category').put(protect, admin, updateCategory)

router.route('/:id').get(protect, admin, fetchCategoryById)

export default router
