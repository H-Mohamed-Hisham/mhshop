import React, { useEffect } from 'react'
import { Row, Col, Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import moment from 'moment'

// * Components
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Paginate from '../../components/Paginate'
import Count from '../../components/Count'

import { fetchMyOrders } from './../../actions/orderAction'

const MyOrderListPage = () => {
  const dispatch = useDispatch()

  const myOrderList = useSelector((state) => state.myOrderList)
  const { loading, error, orders, page, pages, docCount, count, pageSize } =
    myOrderList

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  return (
    <Row className='py-3'>
      <Col>
        <h3>My Orders</h3>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message>{error}</Message>
        ) : orders.length === 0 ? (
          <Message>No Orders To Display</Message>
        ) : (
          <Col>
            {' '}
            <Row>
              <Col>
                <Count
                  count={count}
                  docCount={docCount}
                  pageSize={pageSize}
                  length={orders.length}
                  title='Products'
                />
              </Col>
            </Row>
            <Row>
              <Table striped bordered hover responsive className='table-sm'>
                <thead>
                  <tr>
                    <th>ID #</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>IS DELIVERED ?</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className='text-uppercase'>{order._id}</td>
                      <td>{moment(order.paidAt).format('MMM Do YYYY')}</td>
                      <td>₹{order.totalPrice}</td>

                      <td className='text-center'>
                        {order.isDelivered ? (
                          <i
                            className='fas fa-check-circle '
                            style={{ color: 'green', fontSize: '16px' }}
                          ></i>
                        ) : (
                          <i
                            className='fas fa-times-circle'
                            style={{ color: 'red', fontSize: '16px' }}
                          ></i>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/myorder/${order._id}`}>
                          <Button
                            className='btn-sm custom-button-border'
                            variant='light'
                          >
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
            <Row>
              <Col>
                <Paginate pages={pages} page={page} />
              </Col>
            </Row>{' '}
          </Col>
        )}
      </Col>
    </Row>
  )
}

export default MyOrderListPage
