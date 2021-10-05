import React, { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

// * Actions
import { fetchAllProducts } from '../actions/productAction'

// * Components
import Message from '../components/Message'
import Loader from '../components/Loader'
import Product from '../components/Product'
import Paginate from '../components/Paginate'
import Count from '../components/Count'

const HomePage = ({ match }) => {
  const keyword = match.params.keyword || ''
  const pageNumber = match.params.pageNumber || 1

  const link = '/page'

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const {
    loading: loadingProducts,
    error: errorProducts,
    products,
    page,
    pages,
    docCount,
    count,
    pageSize,
  } = productList

  useEffect(() => {
    dispatch(fetchAllProducts(pageNumber, keyword))
  }, [dispatch, pageNumber, keyword])

  return (
    <>
      <Row>
        <Col md={12}>
          {loadingProducts ? (
            <Loader />
          ) : errorProducts ? (
            <Message>{errorProducts}</Message>
          ) : !loadingProducts && products.length === 0 ? (
            <Message>No Products To Display</Message>
          ) : (
            <Col>
              {' '}
              <h3 className='text-center'>Latest Products</h3>
              <Row>
                <Col>
                  <Count
                    count={count}
                    docCount={docCount}
                    pageSize={pageSize}
                    length={products.length}
                    title='Products'
                  />
                </Col>
              </Row>
              <Row>
                {products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Row>
                <Col>
                  <Paginate pages={pages} page={page} link={link} />
                </Col>
              </Row>{' '}
            </Col>
          )}
        </Col>
      </Row>
    </>
  )
}

export default HomePage
