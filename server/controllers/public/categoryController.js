import asyncHandler from 'express-async-handler'

// * Model
import Category from '../../models/categoryModel.js'

// ! Public Access

// * @desc - Fetch All Category
// * @route - GET /api/public/category
// * @access - Public
const fetchAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({})

  res.json(categories)
})

// * @desc - Fetch Category By Id
// * @route - GET /api/public/category/:id
// * @access - Public
const fetchCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

export { fetchAllCategory, fetchCategoryById }
