import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Table } from 'react-bootstrap'
import moment from 'moment'
import axios from 'axios'

// * CSS
import '../../css/orderdetailstyle.css'

// * Components
import Message from '../../components/Message'
import Loader from '../../components/Loader'

const MyOrderDetailPage = ({ match }) => {
  const orderId = match.params.id

  // Fetch Order State
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  async function fetchMyOrderById(orderId) {
    try {
      setLoading(true)
      const userToken = localStorage.getItem('mhshop')

      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }

      const response = await axios.get(`/api/order/myorder/${orderId}`, config)

      const { data: order } = response

      setOrder(order)
      setLoading(false)
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyOrderById(orderId)
  }, [orderId])

  return (
    <Row>
      {loading ? (
        <Col md={12}>
          <Loader />
        </Col>
      ) : error !== null ? (
        <Col md={12}>
          <Message>{error}</Message>
        </Col>
      ) : (
        <>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3 className='mb-3'>Order Details</h3>
                <p>
                  <span className='font-weight-bold'> Order Date: </span>
                  <span>
                    {moment(order.paidAt).format('MMM Do YYYY, h:mm a')}
                  </span>{' '}
                </p>
                <p>
                  <span className='font-weight-bold'> Order #: </span>
                  <span className='text-uppercase'>{order._id}</span>{' '}
                </p>
                <p>
                  <span className='font-weight-bold'>
                    {' '}
                    Order Total: ₹{order.totalPrice}{' '}
                  </span>
                  ({order.orderItems.length} item(s))
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h3 className='mb-3'>Shipping Address</h3>
                <p>
                  <span className='font-weight-bold'>Name: </span>{' '}
                  {order.user.name}
                </p>
                <p>
                  <span className='font-weight-bold'>Email: </span>
                  {order.user.email}
                </p>
                <p>
                  <span className='font-weight-bold'>Address: </span>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}.
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h3 className='mb-3'>Payment Information</h3>
                <p>
                  <span className='font-weight-bold'>Payment Method: </span>{' '}
                  {order.paymentMethod}
                </p>

                {order.isPaid && (
                  <Message variant='success'>
                    <i className='fas fa-check-circle'></i> Paid On{' '}
                    {moment(order.paidAt).format('MMM Do YYYY, h:mm a')}
                  </Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h3 className='mb-3'>Tracking Details</h3>
                <div className='order-track'>
                  <div className='order-track-step'>
                    <div className='order-track-status'>
                      <span
                        className={
                          order.isShipped
                            ? 'order-track-status-dot-active'
                            : 'order-track-status-dot-disabled'
                        }
                      >
                        <i
                          className={
                            order.isShipped
                              ? 'fas fa-check checkmark-active'
                              : ''
                          }
                        ></i>
                      </span>
                      <span
                        className={
                          order.isShipped
                            ? 'order-track-status-line-active'
                            : 'order-track-status-line-disabled'
                        }
                      ></span>
                    </div>
                    <div className='order-track-text'>
                      <p className='order-track-text-stat'>Shipped</p>
                      <span className='order-track-text-sub'>
                        {order.isShipped
                          ? moment(order.shippedAt).format(
                              'MMM Do YYYY, h:mm:ss a'
                            )
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className='order-track-step'>
                    <div className='order-track-status'>
                      <span
                        className={
                          order.outForDelivery
                            ? 'order-track-status-dot-active'
                            : 'order-track-status-dot-disabled'
                        }
                      >
                        <i
                          className={
                            order.outForDelivery
                              ? 'fas fa-check checkmark-active'
                              : ''
                          }
                        ></i>
                      </span>
                      <span
                        className={
                          order.outForDelivery
                            ? 'order-track-status-line-active'
                            : 'order-track-status-line-disabled'
                        }
                      ></span>
                    </div>
                    <div className='order-track-text'>
                      <p className='order-track-text-stat'>Out For Delivery</p>
                      <span className='order-track-text-sub'>
                        {order.outForDelivery
                          ? moment(order.outForDeliveryAt).format(
                              'MMM Do YYYY, h:mm:ss a'
                            )
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className='order-track-step'>
                    <div className='order-track-status'>
                      <span
                        className={
                          order.isDelivered
                            ? 'order-track-status-dot-active'
                            : 'order-track-status-dot-disabled'
                        }
                      >
                        <i
                          className={
                            order.isDelivered
                              ? 'fas fa-check checkmark-active'
                              : ''
                          }
                        ></i>
                      </span>
                      <span
                        className={
                          order.isDelivered
                            ? 'order-track-status-line-active'
                            : 'order-track-status-line-disabled'
                        }
                      ></span>
                    </div>
                    <div className='order-track-text'>
                      <p className='order-track-text-stat'>Delivered</p>
                      <span className='order-track-text-sub'>
                        {order.isDelivered
                          ? moment(order.DeliveredAt).format(
                              'MMM Do YYYY, h:mm:ss a'
                            )
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>

              <ListGroup.Item className='mb-3'>
                <h3 className='mb-3'>Order Items</h3>
                <Table striped hover responsive className='table-sm'>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Image
                            src={item.image}
                            alt={item.name}
                            className='table-product-image'
                          />
                        </td>
                        <td>
                          <Link to={`/product/${item.productId}`}>
                            {item.name}
                          </Link>

                          <p className='m-0'>Price : ₹{item.price}</p>
                          <p className='m-0'>
                            {item.quantity} x ₹{item.price} = ₹
                            {item.quantity * item.price}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4} className='mb-3'>
            <Card bg='Primary'>
              <Card.Header>
                <h3>Order Summary</h3>
              </Card.Header>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Items:</Col>
                    <Col>₹{order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>₹{order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax:</Col>
                    <Col>₹{order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item variant='dark'>
                  <Row>
                    <Col className='font-weight-bold'>Total:</Col>
                    <Col className='font-weight-bold'>₹{order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </>
      )}
    </Row>
  )
}

export default MyOrderDetailPage
