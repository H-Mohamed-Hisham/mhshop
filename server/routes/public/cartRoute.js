import express from 'express'

// * Controller
import { fetchCartProducts } from '../../controllers/public/cartController.js'

const router = express.Router()

router.route('/').post(fetchCartProducts)

export default router
