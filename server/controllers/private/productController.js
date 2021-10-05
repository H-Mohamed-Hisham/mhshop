import asyncHandler from 'express-async-handler'
import path from 'path'
import fs from 'fs'

// * Model
import Product from '../../models/productModel.js'

// * Validator
import { validateProductData } from '../../validator/productValidator.js'
import { validateProductReviewData } from '../../validator/reviewValidator.js'

// ! Private Access

// * @desc - Create New Review
// * @route - PUT /api/private/product/reviews/:id
// * @access - Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  // * Validate product review data
  const { valid, inputError } = validateProductReviewData(rating, comment)

  if (!valid) {
    return res.json({
      inputError,
    })
  }

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product Already Reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Thanks for submitting the review!' })
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

// ! Admin Access

// * @desc - Fetch All Products
// * @route - GET /api/private/product
// * @access - Admin
const fetchAllProducts = asyncHandler(async (req, res) => {
  const pageSize = 8
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })

  const products = await Product.find({ ...keyword })
    .populate('category', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  const docCount = pageSize * (page - 1)

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    docCount,
    count,
    pageSize,
  })
})

// * @desc - Fetch Product By ID
// * @route - GET /api/private/product/:id
// * @access - Admin
const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'category',
    'name'
  )

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// * @desc - Create Product
// * @route - POST /api/private/product/
// * @access - Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'PC',
    price: 100,
    user: req.user._id,
    image:
      'https://res.cloudinary.com/hm-hisham/image/upload/v1633281724/MH-SHOP/Update_fyg1hq.jpg',
    brand: 'Sample Brand',
    category: '60c8e7838e98474510f82e1f',
    countInStock: 1,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save()
  res.status(201).json({ message: 'Product Created', product: createdProduct })
})

// * @desc - Update Product
// * @route - PUT /api/private/product/:id
// * @access - Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock, image } =
    req.body

  // * Validate product data
  const { valid, inputError } = validateProductData(
    name,
    price,
    description,
    brand,
    category,
    countInStock
  )

  if (!valid) {
    return res.json({
      inputError,
    })
  }

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.image = image
    product.user = req.user._id

    const updatedProduct = await product.save()
    res
      .status(201)
      .json({ product: updatedProduct, message: 'Product updated' })
  } else {
    return res.status(404).json({
      error: 'Product not found',
    })
  }
})

// * @desc - Delete Product
// * @route - DELETE /api/product/:id
// * @access - Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

export {
  createProductReview,
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
