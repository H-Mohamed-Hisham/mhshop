import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Form, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// * Components
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from './../../components/FormContainer'

// * Actions
import { privateFetchAllCategory } from '../../actions/categoryAction'

const CategoryListPage = () => {
  const dispatch = useDispatch()

  // ! Logged in user state
  const userDetail = useSelector((state) => state.userDetail)
  const { loading: userLoading, error: userError, user } = userDetail

  // ! Category list state
  const privateCategoryList = useSelector((state) => state.privateCategoryList)
  const { loading, error, categories } = privateCategoryList

  // ! Data state
  const [name, setName] = useState('')
  const [dataError, setDataError] = useState(null)

  // ! Create category state
  const [createCategoryLoading, setCreateCategoryLoading] = useState(false)
  const [createCategorySuccess, setCreateCategorySuccess] = useState(false)
  const [createCategorySuccessData, setCreateCategorySuccessData] =
    useState(null)
  const [createCategoryError, setCreateCategoryError] = useState(null)

  // ! Create category function
  async function createCategory(category) {
    try {
      setCreateCategorySuccessData(null)
      setCreateCategoryLoading(true)

      if (name === '') {
        setCreateCategoryLoading(false)
        setDataError('Category name must not be empty')
      } else {
        setDataError(null)
        const userToken = localStorage.getItem('mhshop')

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        }

        const { data } = await axios.post(
          `/api/private/category/create-category`,
          category,
          config
        )

        if (data.create_message) {
          setCreateCategoryLoading(false)
          setName('')
          setCreateCategorySuccess(true)
          setCreateCategorySuccessData(data.create_message)
        }
      }
    } catch (error) {
      setCreateCategoryLoading(false)
      setCreateCategorySuccess(false)
      setCreateCategoryError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }

  // ! Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    createCategory({
      name: name,
    })
  }

  useEffect(() => {
    dispatch(privateFetchAllCategory())
  }, [dispatch, createCategorySuccess])

  return (
    <>
      <Row className='pb-3'>
        {userLoading && <Loader />}
        {userError !== null ||
          (user !== null && (
            <Col>
              <FormContainer>
                <h3 className='pb-3'>Category</h3>
                <h5>Create Category</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId='name'>
                    <Form.Control
                      type='text'
                      placeholder='Enter Category'
                      name='name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      isInvalid={dataError !== null ? true : false}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                      {dataError}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {!createCategoryLoading &&
                    createCategorySuccess &&
                    createCategoryError === null && (
                      <Message variant='success'>
                        {createCategorySuccessData}
                      </Message>
                    )}
                  {!createCategoryLoading && createCategoryError !== null && (
                    <Message>{createCategoryError}</Message>
                  )}
                  <Button
                    type='submit'
                    variant='primary'
                    disabled={createCategoryLoading}
                  >
                    Create
                  </Button>
                </Form>
              </FormContainer>
            </Col>
          ))}
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : categories.length <= 0 ? (
        <Message>No Data Found</Message>
      ) : (
        <>
          <Row>
            <Col>
              <FormContainer>
                <Table striped bordered hover responsive className='table-sm'>
                  <thead>
                    <tr>
                      <th>CATEGORY</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>

                        <td>
                          <LinkContainer
                            to={`/admin/category/edit/${item._id}`}
                          >
                            <Button
                              type='button'
                              variant='dark'
                              className='btn-sm'
                            >
                              <i className='fas fa-edit'></i>
                            </Button>
                          </LinkContainer>
                          {/* <Button
                          type='button'
                          variant='danger'
                          className='btn-sm'
                        >
                          <i className='fas fa-trash'></i>
                        </Button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </FormContainer>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default CategoryListPage
