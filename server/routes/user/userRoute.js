import express from 'express'

// * Controller
import {
  signup,
  signin,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  forgotPassword,
  resetPassword,
} from '../../controllers/user/userController.js'

// * Middleware
import { protect } from '../../middleware/authMiddleware.js'

const router = express.Router()

router.route('/signup').post(signup)

router.route('/signin').post(signin)

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

router.route('/updatepassword').put(protect, updateUserPassword)

router.route('/forgotpassword').post(forgotPassword)

router.route('/resetpassword').put(resetPassword)

export default router
