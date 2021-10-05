import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let authToken

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      authToken = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(authToken, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      // console.error(error);
      res.status(401)
      throw new Error('Not authorized, Token failed / Token expired')
    }
  }

  if (!authToken) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.role === 1) {
    next()
  } else {
    res.status(401)
    throw new Error('Not Authorized as an Admin')
  }
}

export { protect, admin }
