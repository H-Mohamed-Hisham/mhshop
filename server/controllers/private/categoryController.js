import asyncHandler from 'express-async-handler'

// * Model
import Category from '../../models/categoryModel.js'

// ! Admin Access

// * @desc - Fetch All Category
// * @route - GET /api/private/category
// * @access - Admin
const fetchAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({})

  res.json(categories)
})

// * @desc - Fetch Category By Id
// * @route - GET /api/private/category/:id
// * @access - Admin
const fetchCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// * @desc - Create Category
// * @route - POST /api/private/category
// * @access - Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body

  const category = await Category.create({
    name,
  })

  if (category) {
    res.status(201).json({ create_message: 'Category added' })
  } else {
    res.status(400)
    throw new Error(
      'Category not created, Something went wrong. Please Try Again'
    )
  }
})

// * @desc - Update Category
// * @route - PUT /api/private/category
// * @access - Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { id, name } = req.body

  const category = await Category.findById(id)

  if (category) {
    category.name = name

    const updatedCategory = await category.save()
    res.json({
      category: updatedCategory,
      message: 'Category updated',
    })
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

export { fetchAllCategory, fetchCategoryById, createCategory, updateCategory }
