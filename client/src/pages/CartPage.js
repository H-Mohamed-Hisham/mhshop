import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Row,
  Col,
  Image,
  Button,
  Card,
  ListGroup,
  Container,
} from 'react-bootstrap'

// COMPONENTS

import Message from '../components/Message'
import Loader from '../components/Loader'

// CSS

import '../css/cartstyle.css'

import {
  CART_CLEAR,
  CART_PRODUCT_QTY,
  CART_PRODUCT_REMOVE,
  CART_PRODUCT_RESET,
  CHECKOUT_CART,
} from '../constants/cartConstant'

import { removeFromCart, productCart } from '../actions/cartAction'

const CartPage = ({ history }) => {
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const cartProduct = useSelector((state) => state.cartProduct)
  const { loading, cartProductItems, error } = cartProduct

  useEffect(() => {
    dispatch(productCart())
  }, [dispatch, cartItems])

  // Clear all products from cart
  const clearCartHandler = () => {
    dispatch({ type: CART_PRODUCT_RESET })
    dispatch({ type: CART_CLEAR })
  }

  // Remove specific product from cart using product id
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
    dispatch({
      type: CART_PRODUCT_REMOVE,
      payload: {
        id,
      },
    })
  }

  // Decrease Item Quantity
  function decreaseQuantity(itemId) {
    let itemIndex = cartProductItems.findIndex((x) => x._id === itemId)
    let itemQuantity = cartProductItems[itemIndex]['quantity']

    if (itemQuantity > 1) {
      let updatedItemQuantity = itemQuantity - 1
      dispatch({
        type: CART_PRODUCT_QTY,
        payload: {
          id: itemId,
          qty: Number(updatedItemQuantity),
        },
      })
    }
  }

  // Increase Item Quantity
  function increaseQuantity(itemId) {
    let itemIndex = cartProductItems.findIndex((x) => x._id === itemId)
    let itemQuantity = cartProductItems[itemIndex]['quantity']

    if (itemQuantity >= 1) {
      let updatedItemQuantity = itemQuantity + 1
      dispatch({
        type: CART_PRODUCT_QTY,
        payload: {
          id: itemId,
          qty: Number(updatedItemQuantity),
        },
      })
    }
  }

  // Check out handler
  const checkoutHandler = () => {
    dispatch({ type: CHECKOUT_CART })
    history.push('/signin?redirect=shipping')
  }

  return (
    <>
      <Row className='py-3'>
        <Col className='my-2 text-center'>
          <h3>My Shopping Cart</h3>
          <hr />
        </Col>
      </Row>
      <Row>
        {loading ? (
          <Loader />
        ) : cartItems.length === 0 ? (
          <Col xs={12} md={12} className='mb-4'>
            <Message>
              Your shopping cart is empty!{' '}
              <Link to='/' className='text-info'>
                Continue shopping
              </Link>{' '}
            </Message>
          </Col>
        ) : error ? (
          <Message>{error}</Message>
        ) : (
          <>
            <Col xs={12} md={12} className='mb-4 text-center'>
              <Button
                type='button'
                variant='danger'
                size='sm'
                onClick={() => clearCartHandler()}
              >
                <i className='fas fa-trash'></i> Clear Cart
              </Button>
            </Col>
            <Col xs={12} md={12}>
              <hr />
            </Col>

            {cartProductItems.filter(
              (cartProductItems) => cartProductItems.countInStock > 0
            ).length > 0 && (
              <Container>
                {cartProductItems
                  .filter(
                    (cartProductItems) => cartProductItems.countInStock > 0
                  )
                  .map((item, index) => (
                    <Row
                      key={item._id}
                      className={
                        'py-3 mb-3 list-row-ml-mr ' +
                        (index % 2 === 0 ? 'cart-item-bg' : '')
                      }
                    >
                      <Col xs={12} md={2} lg={2} className='mb-2'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          className='cart-product-image'
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4} className='mb-2'>
                        <p className='mb-0'>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </p>
                        <p className='mb-0'>Price : ₹{item.price}</p>
                        <p className='mb-0'>
                          Quantity * Price :
                          {item.countInStock > 0
                            ? ` ${item.quantity} x ₹${item.price} = ₹${
                                item.quantity * item.price
                              }`
                            : ' '}
                        </p>
                      </Col>
                      <Col xs={6} md={4} lg={4} className='mb-2'>
                        <div className='quantity-total'>
                          <div className='quantity-totalcount-wrapper'>
                            {item.countInStock > 0 ? (
                              <>
                                <div className='form-group mb-1'>
                                  <div className='input-group'>
                                    <Button
                                      variant='primary'
                                      size='sm'
                                      disabled={item.quantity <= 1}
                                      onClick={() => decreaseQuantity(item._id)}
                                    >
                                      -
                                    </Button>
                                    <span className='mw-100 px-2 quantity-count'>
                                      {item.quantity}
                                    </span>

                                    <Button
                                      variant='primary'
                                      size='sm'
                                      disabled={
                                        item.quantity >= item.countInStock
                                      }
                                      onClick={() => increaseQuantity(item._id)}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <Message>Out of stock</Message>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        md={2}
                        lg={2}
                        className='mb-2 remove-button-div'
                      >
                        <Button
                          type='button'
                          variant='danger'
                          size='sm'
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </Row>
                  ))}
              </Container>
            )}

            {cartProductItems.filter(
              (cartProductItems) => cartProductItems.countInStock === 0
            ).length > 0 && (
              <Col xs={12} md={12}>
                <hr />
                <p className='text-warning'>
                  Oops! Some products from your cart is currently OUT OF STOCK.
                  These products won't be added for checkout.
                </p>
                <hr />
              </Col>
            )}

            {cartProductItems.filter(
              (cartProductItems) => cartProductItems.countInStock === 0
            ).length > 0 && (
              <Container>
                {cartProductItems
                  .filter(
                    (cartProductItems) => cartProductItems.countInStock === 0
                  )
                  .map((item, index) => (
                    <Row
                      key={item._id}
                      className={
                        'py-3 mb-3 list-row-ml-mr ' +
                        (index % 2 === 0 ? 'cart-item-bg' : '')
                      }
                    >
                      <Col xs={12} md={2} lg={2} className='mb-2'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          className='cart-product-image'
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4} className='mb-2'>
                        <p className='mb-0'>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </p>
                        <p className='mb-0'>Price : ₹{item.price}</p>
                      </Col>
                      <Col xs={6} md={4} lg={4} className='mb-2'>
                        <Message className='text-center'>Out of stock</Message>
                      </Col>
                      <Col xs={6} md={2} lg={2} className='remove-button-div'>
                        <Button
                          type='button'
                          variant='danger'
                          size='sm'
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </Row>
                  ))}
              </Container>
            )}
          </>
        )}
      </Row>

      {!loading &&
        cartItems.length > 0 &&
        cartProductItems.filter(
          (cartProductItems) => cartProductItems.countInStock > 0
        ).length > 0 && <hr />}
      <Row>
        <Col>
          {!loading &&
            !error &&
            cartItems.length > 0 &&
            cartProductItems.filter(
              (cartProductItems) => cartProductItems.countInStock > 0
            ).length > 0 && (
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2>
                      Subtotal (
                      {cartProductItems.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                      ) items
                    </h2>
                    <h3>
                      Total Amount ₹
                      {cartProductItems
                        .reduce(
                          (acc, item) => acc + item.quantity * item.price,
                          0
                        )
                        .toFixed(2)}
                    </h3>
                    {cartItems.length > 0 && (
                      <Button variant='success' onClick={checkoutHandler}>
                        Proceed To Checkout{' '}
                        <i className='fa fa-arrow-circle-right'></i>
                      </Button>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            )}
        </Col>
      </Row>
      <br />
    </>
  )
}

export default CartPage
