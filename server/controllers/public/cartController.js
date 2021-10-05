import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'

// * Model
import Product from '../../models/productModel.js'

// * @desc - Fetch Cart Products
// * @route - POST /api/product/cart
// * @access - Public
const fetchCartProducts = asyncHandler(async (req, res) => {
  const productId = req.body

  try {
    const cartProduct = await Product.find({
      _id: {
        $in: productId,
      },
    }).select('name image price _id countInStock')

    if (cartProduct) {
      res.json(cartProduct)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      throw new Error('Cast Error')
    }
  }
})

export { fetchCartProducts }
