import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Badge,
} from 'react-bootstrap'
import axios from 'axios'
import moment from 'moment'

// * CSS
import '../css/productcardstyle.css'

// * Components
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from './../components/Meta'

// * Actions
import { addToCart, removeFromCart } from '../actions/cartAction'

const ProductDetailPage = ({ match }) => {
  const productId = match.params.productId

  // Product Detail State
  const [productDetailLoading, setProductDetailLoading] = useState(true)
  const [product, setProduct] = useState({})
  const [productDetailFail, setProductDetailFail] = useState(null)

  // Product Review Submit State
  const [reviewInputError, setReviewInputError] = useState({})
  const [loadingProductReview, setLoadingProductReview] = useState(false)
  const [errorProductReview, setErrorProductReview] = useState(null)
  const [successProductReview, setSuccessProductReview] = useState(false)
  const [messageProductReview, setMessageProductReview] = useState(null)

  // Product Review Default Value State
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const userDetail = useSelector((state) => state.userDetail)
  const { user: userInfo } = userDetail

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  async function fetchProductDetail(productId) {
    try {
      setProductDetailLoading(true)

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.get(
        `/api/public/product/${productId}`,
        config
      )

      setProduct(data)

      setProductDetailLoading(false)
    } catch (error) {
      setProductDetailLoading(false)
      setProductDetailFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }

  // ! Review Submit Handler
  const submitHandler = (e) => {
    e.preventDefault()
    setLoadingProductReview(true)
    setErrorProductReview(null)
    setReviewInputError({})
    createProductReview({ rating, comment })
  }

  // ! Review Submit Function
  async function createProductReview(reviewData) {
    try {
      const userToken = localStorage.getItem('mhshop')

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }
      const response = await axios.post(
        `/api/private/product/add-review/${productId}`,
        reviewData,
        config
      )

      const { message, inputError } = response.data

      if (inputError) {
        setLoadingProductReview(false)
        setReviewInputError(inputError)
      }

      if (message) {
        setLoadingProductReview(false)
        setSuccessProductReview(true)
        setMessageProductReview(message)
      }
    } catch (error) {
      setLoadingProductReview(false)

      error.response && error.response.data.message
        ? setErrorProductReview(error.response.data.message)
        : setErrorProductReview(error.message)
    }
  }

  // ! Add To Cart Handler
  const addToCartHandler = (id) => {
    dispatch(addToCart(id))
  }

  // ! Remove From Cart Handler
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
    }
    fetchProductDetail(productId)
  }, [productId, successProductReview])

  return (
    <>
      {productDetailLoading ? (
        <Loader />
      ) : productDetailFail ? (
        <Message variant='danger'>{productDetailFail}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={4} className='pb-3'>
              <Row className=' mb-1'>
                <Col md={12}>
                  <Image src={product.image} alt={product.name} fluid />
                </Col>
              </Row>
            </Col>
            <Col md={8} className='pb-3'>
              <Card className='no-border'>
                <Card.Body>
                  <Card.Subtitle className='mb-2 text-muted'>
                    {product.brand}
                  </Card.Subtitle>
                  <Card.Title as='h2'>{product.name}</Card.Title>
                  <Card.Subtitle className='mb-2 text-muted'>
                    {product.category.name}
                  </Card.Subtitle>
                  <Card.Text>
                    <Badge variant='primary'>₹{product.price}</Badge>
                  </Card.Text>
                  <Card.Text>{product.description}</Card.Text>
                  <Card.Text>
                    {product.countInStock > 0 ? (
                      <span className='text-success'>Available</span>
                    ) : (
                      <span className='text-danger'>Out Of Stock</span>
                    )}
                  </Card.Text>
                  <div className='product-card-button-group'>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} Reviews`}
                    />
                    {cartItems.find((element) => element === product._id) ? (
                      <Button
                        type='button'
                        disabled={product.countInStock === 0}
                        size='sm'
                        variant='danger'
                        onClick={() => removeFromCartHandler(product._id)}
                      >
                        <i className='fas fa-trash px-1'></i>
                        Remove From Cart
                      </Button>
                    ) : (
                      <Button
                        type='button'
                        disabled={product.countInStock === 0}
                        size='sm'
                        onClick={() => addToCartHandler(product._id)}
                      >
                        <i className='fas fa-shopping-cart px-1'></i>
                        Add To Cart
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <hr />

          {/* Review Section */}
          <Row className='py-4'>
            <Col md={6} className='py-3'>
              <h3 className='pb-2'>Write a Review</h3>
              {loadingProductReview && <Loader />}
              {errorProductReview !== null && (
                <Message variant='danger'>{errorProductReview}</Message>
              )}
              {!loadingProductReview && messageProductReview && (
                <Message variant='success'>{messageProductReview}</Message>
              )}
              {!loadingProductReview && userInfo !== null && (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId='rating'>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as='select'
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      isInvalid={reviewInputError.rating ? true : false}
                    >
                      <option value=''>Select...</option>
                      <option value='1'>1 - Poor</option>
                      <option value='2'>2 - Fair</option>
                      <option value='3'>3 - Good</option>
                      <option value='4'>4 - Very Good</option>
                      <option value='5'>5 - Excellent</option>
                    </Form.Control>
                    {reviewInputError.rating && (
                      <div className='invalid-feedback'>
                        {reviewInputError.rating}
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group controlId='comment'>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as='textarea'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      isInvalid={reviewInputError.comment ? true : false}
                    ></Form.Control>
                    {reviewInputError.comment && (
                      <div className='invalid-feedback'>
                        {reviewInputError.comment}
                      </div>
                    )}
                  </Form.Group>
                  <Button type='submit' variant='primary'>
                    Submit Review
                  </Button>
                </Form>
              )}
              {!loadingProductReview && userInfo === null && (
                <Message>
                  Please <Link to='/signin'>Sign In</Link> to write a review
                </Message>
              )}
            </Col>
            <Col md={6} className='py-3'>
              <h3 className='pb-2'>Reviews</h3>
              {product.reviews.length === 0 && (
                <Message variant='info'>No Reviews</Message>
              )}
              <ListGroup>
                {product.reviews.map((review) => {
                  return (
                    <ListGroup.Item key={review._id}>
                      <div className='d-flex w-100 justify-content-between'>
                        <h5 className='mb-1'>{review.name}</h5>
                        <small className='text-muted'>
                          <Rating value={review.rating} />
                        </small>
                      </div>

                      <p className='mb-1'>{review.comment}</p>
                      <small className='text-muted'>
                        {moment(review.createdAt).format('dddd, MMMM Do YYYY')}
                      </small>
                    </ListGroup.Item>
                  )
                })}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductDetailPage
