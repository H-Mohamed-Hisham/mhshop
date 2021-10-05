import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Table,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'

// * CSS
import '../css/placeorderstyle.css'

// * Components
import Message from '../components/Message'
import Loader from '../components/Loader'
import CheckoutSteps from '../components/CheckoutSteps'
import FormContainer from '../components/FormContainer'

// * Constants
import { CART_CLEAR, CART_PRODUCT_RESET } from '../constants/cartConstant'

// * Actions
import { saveShippingAddress } from './../actions/cartAction'

const PlaceOrderPage = ({ history }) => {
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const dispatch = useDispatch()

  const checkout = useSelector((state) => state.checkout)
  const { shippingAddress, paymentMethod } = checkout

  const cartProduct = useSelector((state) => state.cartProduct)
  const { checkoutCart } = cartProduct

  useEffect(() => {
    if (checkoutCart.length === 0) {
      history.push('/cart')
    }
    if (paymentStatus === 'succeeded') {
      dispatch({ type: CART_PRODUCT_RESET })
      dispatch({ type: CART_CLEAR })
      dispatch(saveShippingAddress(null))
      history.push(`/myorder/${orderId}`)
    }
  }, [history, checkoutCart, paymentStatus, orderId, dispatch])

  // ! Calculate Prices

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  checkoutCart.itemsPrice = checkoutCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  checkoutCart.shippingPrice = addDecimals(
    checkoutCart.itemsPrice > 100 ? 0 : 20
  )

  checkoutCart.taxPrice = addDecimals(
    Number(0.15 * checkoutCart.itemsPrice.toFixed(2))
  )

  checkoutCart.totalPrice = (
    Number(checkoutCart.itemsPrice) +
    Number(checkoutCart.shippingPrice) +
    Number(checkoutCart.taxPrice)
  ).toFixed(2)

  // ! Payment Function

  async function handleToken(token) {
    setLoading(true)
    const userToken = localStorage.getItem('mhshop')
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    }
    const response = await axios.post(
      '/api/order/checkout',
      {
        token,
        orderItems: checkoutCart,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: checkoutCart.itemsPrice,
        shippingPrice: checkoutCart.shippingPrice,
        taxPrice: checkoutCart.taxPrice,
        totalPrice: checkoutCart.totalPrice,
      },
      config
    )

    const { status, order } = response.data

    if (status) {
      setLoading(false)
    }

    if (status === 'succeeded') {
      setOrderId(order._id)
      setPaymentStatus(status)
    } else {
      setPaymentStatus(status)
      alert('Something went wrong')
    }
  }

  return (
    <>
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />
      </FormContainer>
      <Row className='my-1'>
        {checkoutCart.length >= 1 && (
          <>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>Shipping Address</h3>
                  <p>
                    <strong>Address: </strong>
                    {shippingAddress.address}, {shippingAddress.city},{' '}
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h3>Payment Method</h3>
                  <p>
                    <strong>Method: </strong>
                    {paymentMethod}
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h3>Order Items</h3>
                  {checkoutCart.length === 0 ? (
                    <Message variant='danger'>Your cart is Empty</Message>
                  ) : (
                    <Table striped hover responsive className='table-sm'>
                      <tbody>
                        {checkoutCart.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <Image
                                src={item.image}
                                alt={item.name}
                                className='table-product-image'
                              />
                            </td>
                            <td>
                              <Link to={`/product/${item._id}`}>
                                {item.name}
                              </Link>
                            </td>
                            <td>
                              {item.quantity} x {item.price} = ₹
                              {item.quantity * item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h3>Order Summary</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items:</Col>
                      <Col>₹{checkoutCart.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping:</Col>
                      <Col>₹{checkoutCart.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax:</Col>
                      <Col>₹{checkoutCart.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total:</Col>
                      <Col>₹{checkoutCart.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  {paymentStatus === 'failure' && (
                    <ListGroup.Item>
                      <Message variant='danger'>
                        Payment Failed. Please Try Again
                      </Message>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    {loading && <Loader />}
                    {checkoutCart.length > 0 &&
                      !loading &&
                      paymentMethod === 'Stripe' && (
                        <StripeCheckout
                          stripeKey='pk_test_51HqwsgBrBOrRrnlyyr8TGajVdskvU96Id2THwptH5sltl46vQbUnK7YHGEE0u3OFnlWRWWTTZ3wVzA1aIzbb06cq00X1Vuv0Gk'
                          token={handleToken}
                          amount={checkoutCart.totalPrice * 100}
                          currency='INR'
                          panelLabel='Pay {{amount}}'
                        >
                          <Button className='btn-block btn-grad pay-button'>
                            Pay with <i className='far fa-credit-card'></i>
                          </Button>
                        </StripeCheckout>
                      )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </>
  )
}

export default PlaceOrderPage
