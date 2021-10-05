import express from 'express'

// * Controller
import {
  fetchAllCategory,
  fetchCategoryById,
} from '../../controllers/public/categoryController.js'

const router = express.Router()

router.route('/').get(fetchAllCategory)

router.route('/:id').get(fetchCategoryById)

export default router
