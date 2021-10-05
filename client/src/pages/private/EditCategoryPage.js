import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import axios from 'axios'

// * Components
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import GoBack from '../../components/GoBack'

const EditCategoryPage = ({ match }) => {
  const id = match.params.id

  // ! Logged in user state
  const userDetail = useSelector((state) => state.userDetail)
  const { error: userError, user } = userDetail

  // ! Category detail state
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  // ! Input Error
  const [dataError, setDataError] = useState(null)

  // ! Fetch category by ID function
  async function fetchCategoryById(id) {
    try {
      setLoading(true)

      const userToken = localStorage.getItem('mhshop')

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }

      const { data } = await axios.get(`/api/private/category/${id}`, config)

      setLoading(false)
      setName(data.name)
    } catch (error) {
      setLoading(false)
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }

  // ! Update category state
  const [updateCategoryLoading, setUpdateCategoryLoading] = useState(false)
  const [updateCategorySuccess, setUpdateCategorySuccess] = useState(false)
  const [updateCategorySuccessData, setUpdateCategorySuccessData] =
    useState(null)
  const [updateCategoryError, setUpdateCategoryError] = useState(null)

  // ! Update category function
  async function updateCategory(category) {
    try {
      setUpdateCategorySuccessData(null)
      setUpdateCategoryLoading(true)

      if (name === '') {
        setUpdateCategoryLoading(false)
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

        const { data } = await axios.put(
          `/api/private/category/update-category`,
          category,
          config
        )

        if (data.message) {
          setUpdateCategoryLoading(false)
          setName('')
          setUpdateCategorySuccess(true)
          setUpdateCategorySuccessData(data.message)
        }
      }
    } catch (error) {
      setUpdateCategoryLoading(false)
      setUpdateCategorySuccess(false)
      setUpdateCategoryError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }

  // ! Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    updateCategory({ name: name, id: id })
  }

  useEffect(() => {
    fetchCategoryById(id)
  }, [id, updateCategorySuccess])

  return (
    <>
      {loading && (
        <Row className='pb-3'>
          <Col>
            {' '}
            <Loader />
          </Col>
        </Row>
      )}
      <Row className='pb-3'>
        {userError === null && error && (
          <Col md={12}>
            <FormContainer>
              <Message>{error}</Message>
            </FormContainer>
          </Col>
        )}
        {!loading && user !== null && (
          <Col md={12}>
            <FormContainer>
              <div className='d-flex'>
                <GoBack to='/admin/category' />
                <h3>Edit Category</h3>
              </div>

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
                {!updateCategoryLoading &&
                  updateCategorySuccess &&
                  updateCategoryError === null && (
                    <Message variant='success'>
                      {updateCategorySuccessData}
                    </Message>
                  )}
                {!updateCategoryLoading && updateCategoryError !== null && (
                  <Message>{updateCategoryError}</Message>
                )}
                <Button
                  type='submit'
                  variant='primary'
                  disabled={updateCategoryLoading}
                >
                  Update
                </Button>
              </Form>
            </FormContainer>
          </Col>
        )}
      </Row>
    </>
  )
}

export default EditCategoryPage
