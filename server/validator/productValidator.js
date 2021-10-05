const validateProductData = (
  name,
  price,
  description,
  brand,
  category,
  countInStock
) => {
  const inputError = {}

  var convertedPrice = parseFloat(price).toFixed(2)

  if (name.trim() === '') {
    inputError.name = 'Product name must not be empty'
  }

  if (brand === '') {
    inputError.brand = 'Brand must not be empty'
  }

  if (description === '') {
    inputError.description = 'Description must not be empty'
  }

  if (countInStock === '') {
    inputError.countInStock = 'Count-In-Stock must not be empty'
  } else if (!typeof countInStock === 'number') {
    inputError.countInStock = 'Count-In-Stock must be number'
  }

  if (price === '') {
    inputError.price = 'Price must not be empty'
  } else if (!typeof convertedPrice === 'number') {
    inputError.countInStock = 'Price must be number'
  } else if (convertedPrice <= 0) {
    inputError.price = 'Price must be greater than zero'
  }

  if (category === '') {
    inputError.category = 'Category must not be empty'
  }

  return {
    inputError,
    valid: Object.keys(inputError).length < 1,
  }
}

export { validateProductData }
