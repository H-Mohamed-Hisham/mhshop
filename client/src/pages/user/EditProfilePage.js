import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { Form, Row, Col, Button } from 'react-bootstrap'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// * Components
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import GoBack from '../../components/GoBack'

// * Constants
import { USER_DETAILS_SUCCESS } from '../../constants/userConstant'

// * Actions
import { fetchUserDetail } from './../../actions/userAction'

const EditProfilePage = () => {
  const [name, setName] = useState('')

  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [message, setMessage] = useState(null)
  const [errorUpdate, setErrorUpdate] = useState(null)

  const dispatch = useDispatch()

  const userDetail = useSelector((state) => state.userDetail)
  const { loading, error, user } = userDetail

  useEffect(() => {
    dispatch(fetchUserDetail())
  }, [dispatch])

  useEffect(() => {
    if (user !== null) {
      setName(user.name)
    }
  }, [user, message, dispatch])

  const userProfileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: name,
    },
    validationSchema: yup.object({
      name: yup.string().trim().strict().required('Name required'),
    }),
    onSubmit: (values, { resetForm }) => {
      setErrorUpdate(null)
      updateProfile({
        name: values.name,
      })

      resetForm({ values: '' })
    },
  })

  async function updateProfile(userData) {
    setLoadingUpdate(true)
    try {
      const userToken = localStorage.getItem('mhshop')

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }
      const response = await axios.put(`/api/user/profile`, userData, config)

      const { user, message } = response.data

      dispatch({
        type: USER_DETAILS_SUCCESS,
        payload: user,
      })

      if (message) {
        setLoadingUpdate(false)
        setMessage(message)
      }
    } catch (error) {
      setLoadingUpdate(false)

      error.response && error.response.data.message
        ? setErrorUpdate(error.response.data.message)
        : setErrorUpdate(error.message)
    }
  }

  return (
    <FormContainer>
      <div className='d-flex'>
        <GoBack to='/user/profile' />
        <h3 className='pb-3'>Update Profile</h3>
      </div>

      {loading || loadingUpdate ? (
        <Loader />
      ) : !loading && !loadingUpdate && error ? (
        <Message>{error}</Message>
      ) : !loading && !loadingUpdate && errorUpdate !== null ? (
        <Message>{errorUpdate}</Message>
      ) : (
        <>
          {message && <Message variant='info'>{message}</Message>}
          <Form onSubmit={userProfileForm.handleSubmit}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Name'
                name='name'
                value={userProfileForm.values.name}
                onChange={userProfileForm.handleChange}
                isInvalid={userProfileForm.errors.name ? true : false}
              ></Form.Control>
              <Form.Control.Feedback type='invalid'>
                {userProfileForm.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col xs={6} sm={6} md={6} lg={6}>
                <Button type='submit' variant='primary' className='btn-block'>
                  Update
                </Button>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6}>
                <Button variant='primary' className='btn-block'>
                  <Link className='white-font' to='/user/profile'>
                    Cancel
                  </Link>
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </FormContainer>
  )
}

export default EditProfilePage
