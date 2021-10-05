import express from 'express'
import { protect, admin } from '../../middleware/authMiddleware.js'
import {
  fetchAllOrders,
  fetchOrderById,
  markOrderToShipped,
  unmarkOrderToShipped,
  markOrderToOutForDelivery,
  unmarkOrderToOutForDelivery,
  markOrderTodelivered,
  unmarkOrderTodelivered,
  closeOrder,
} from '../../controllers/private/orderController.js'

const router = express.Router()

router.route('/').get(protect, admin, fetchAllOrders)

router.route('/shipped/:id').put(protect, admin, markOrderToShipped)

router.route('/unmark-shipped/:id').put(protect, admin, unmarkOrderToShipped)

router
  .route('/outfordelivery/:id')
  .put(protect, admin, markOrderToOutForDelivery)

router
  .route('/unmark-outfordelivery/:id')
  .put(protect, admin, unmarkOrderToOutForDelivery)

router.route('/delivered/:id').put(protect, admin, markOrderTodelivered)

router
  .route('/unmark-delivered/:id')
  .put(protect, admin, unmarkOrderTodelivered)

router.route('/closeorder/:id').put(protect, admin, closeOrder)

router.route('/:id').get(protect, admin, fetchOrderById)

export default router
