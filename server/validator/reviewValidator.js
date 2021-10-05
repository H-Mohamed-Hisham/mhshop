const validateProductReviewData = (rating, comment) => {
  const inputError = {}

  if (!typeof rating === 'number') {
    inputError.rating = 'Rating must be in number'
  } else if (rating.trim() === '') {
    inputError.rating = 'Rating must not be empty'
  }

  if (comment.trim() === '') {
    inputError.comment = 'Comment must not be empty'
  }

  return {
    inputError,
    valid: Object.keys(inputError).length < 1,
  }
}

export { validateProductReviewData }
