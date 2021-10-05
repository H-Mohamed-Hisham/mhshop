import asyncHandler from 'express-async-handler'

// * Model
import Product from '../../models/productModel.js'

// ! Public Access

// * @desc - Fetch All Products
// * @route - GET /api/public/product
// * @access - Public
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
// * @route - GET /api/public/product/:id
// * @access - Public
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

// * @desc - Fetch top rated products
// * @route - GET /api/public/product/top
// * @access - Public
const fetchTopRatedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    // .sort({ rating: -1 })
    .limit(3)
  res.json(products)
})

export { fetchAllProducts, fetchProductById, fetchTopRatedProducts }
