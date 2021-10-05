import express from 'express'

// * Controller
import {
  fetchAllProducts,
  fetchProductById,
  fetchTopRatedProducts,
} from '../../controllers/public/productController.js'

const router = express.Router()

router.get('/', fetchAllProducts)

router.get('/topratedproduct', fetchTopRatedProducts)

router.get('/:id', fetchProductById)

export default router
