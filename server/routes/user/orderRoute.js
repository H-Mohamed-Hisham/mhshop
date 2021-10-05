import express from 'express'
import { protect } from '../../middleware/authMiddleware.js'
import {
  checkout,
  myOrdersList,
  myOrderById,
} from '../../controllers/user/orderController.js'

const router = express.Router()

router.route('/checkout').post(protect, checkout)

router.route('/myorders').get(protect, myOrdersList)

router.route('/myorder/:id').get(protect, myOrderById)

export default router
