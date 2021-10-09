import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// Components
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Paginate from '../../components/Paginate'
import Count from '../../components/Count'

// Actions
import { privateFetchAllProducts } from '../../actions/productAction'

const ListProductsPage = ({ match, history }) => {
  const pageNumber = match.params.pageNumber || 1
  const link = '/admin/products/page'

  const dispatch = useDispatch()

  const privateProductList = useSelector((state) => state.privateProductList)
  const {
    loading: loadingProducts,
    error: errorProducts,
    products,
    page,
    pages,
    docCount,
    count,
    pageSize,
  } = privateProductList

  // Product Create State
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [createdProductId, setCreatedProductId] = useState(null)
  const [errorCreate, setErrorCreate] = useState(null)

  // Product Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [errorDelete, setErrorDelete] = useState(null)
  const [successDelete, setSuccessDelete] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // Product Create Function
  async function createProductHandler() {
    try {
      setLoadingCreate(true)
      const userToken = localStorage.getItem('mhshop')

      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }

      const { data } = await axios.post(
        `/api/private/product/create-product`,
        {},
        config
      )

      if (data) {
        setLoadingCreate(false)
        setCreatedProductId(data.product._id)
      }
    } catch (error) {
      setLoadingCreate(false)
      error.response && error.response.data.message
        ? setErrorCreate(error.response.data.message)
        : setErrorCreate(error.message)
    }
  }

  // Delete Modal Popup Function Handler
  const handleClose = () => setShowDeleteModal(false)
  const handleShow = (id) => {
    setShowDeleteModal(true)
    setDeleteId(id)
  }

  // Delete Product Function
  async function deleteHandler(id) {
    try {
      setSuccessDelete(null)
      setShowDeleteModal(false)

      const userToken = localStorage.getItem('mhshop')

      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }

      const { data } = await axios.delete(
        `/api/private/product/delete-product/${id}`,
        config
      )

      if (data.message) {
        setSuccessDelete(data.message)
        setDeleteId(null)
        dispatch(privateFetchAllProducts(pageNumber))
      }
    } catch (error) {
      error.response && error.response.data.message
        ? setErrorDelete(error.response.data.message)
        : setErrorDelete(error.message)
    }
  }

  useEffect(() => {
    dispatch(privateFetchAllProducts(pageNumber))
    if (createdProductId !== null) {
      history.push(`/admin/product/edit/${createdProductId}`)
    }
  }, [dispatch, pageNumber, createdProductId, history])

  return (
    <>
      <Row className='align-items-center py-3'>
        <Col>
          <h3>Products</h3>
        </Col>
        <Col className='text-right'>
          {errorCreate !== null && <Message>{errorCreate}</Message>}
          {loadingCreate && <Loader />}
          {!loadingProducts && !loadingCreate && !errorProducts && (
            <Button className='my-3' onClick={createProductHandler}>
              <i className='fas fa-plus'></i> Create Product
            </Button>
          )}
        </Col>
      </Row>
      {errorDelete !== null && (
        <Row className='align-items-center'>
          <Col>
            <Message>{errorDelete}</Message>
          </Col>
        </Row>
      )}
      {successDelete !== null && (
        <Row className='align-items-center'>
          <Col>
            <Message variant='success'>{successDelete}</Message>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          {loadingProducts ? (
            <Loader />
          ) : errorProducts ? (
            <Message>{errorProducts}</Message>
          ) : products.length < 1 ? (
            <Message>No Products To Display</Message>
          ) : (
            <>
              <Count
                count={count}
                docCount={docCount}
                pageSize={pageSize}
                length={products.length}
              />
              <Table striped bordered hover responsive className='table-sm'>
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>PRICE</th>
                    <th>CATEGORY</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>{item.category.name}</td>
                      <td>
                        <LinkContainer to={`/admin/product/edit/${item._id}`}>
                          <Button
                            type='button'
                            variant='dark'
                            className='btn-sm mr-1'
                          >
                            <i className='fas fa-edit'></i>
                          </Button>
                        </LinkContainer>

                        <Button
                          variant='danger'
                          className='btn-sm'
                          onClick={() => handleShow(item._id)}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Paginate pages={pages} page={page} link={link} />
        </Col>
      </Row>

      {/* Delete Modal Popup */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this product ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => handleClose}>
              Cancel
            </Button>
            <Button variant='primary' onClick={() => deleteHandler(deleteId)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

export default ListProductsPage
