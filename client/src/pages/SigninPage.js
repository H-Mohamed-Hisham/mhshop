import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Row, Col, Button } from 'react-bootstrap'

import { useFormik } from 'formik'
import * as yup from 'yup'

import axios from 'axios'
// import jwtDecode from 'jwt-decode'

// * Components
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

// * Constants
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
} from '../constants/userConstant'

// * Actions
import { fetchUserDetail } from './../actions/userAction'

const SigninPage = ({ location, history }) => {
  const redirect = location.search ? location.search.split('=')[1] : '/'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inputError, setInputError] = useState({})

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userLoginInfo } = userLogin

  useEffect(() => {
    if (userLoginInfo) {
      history.push(redirect)
    }
  }, [history, userLoginInfo, redirect])

  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup.string().required('Email must not be empty'),
      password: yup.string().required('Password must not be empty'),
    }),
    onSubmit: (values, { resetForm }) => {
      setInputError({})
      setError(null)
      signin(values.email, values.password)
      resetForm({ values: '' })
    },
  })

  // ! Signin Function
  async function signin(email, password) {
    setLoading(true)

    dispatch({
      type: USER_LOGIN_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      `/api/user/signin`,
      { email, password },
      config
    )

    if (data.inputError) {
      setLoading(false)
      dispatch({
        type: USER_LOGIN_FAIL,
      })

      setInputError(data.inputError)
    }

    if (data.error) {
      setLoading(false)
      dispatch({
        type: USER_LOGIN_FAIL,
      })
      setError(data.error)
    } else {
      setLoading(false)
      localStorage.setItem('mhshop', data.token)

      let token = localStorage.getItem('mhshop')
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: token,
      })

      dispatch(fetchUserDetail())
    }
  }

  return (
    <FormContainer>
      <h1 className='my-4'>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader></Loader>}
      <Form onSubmit={loginForm.handleSubmit} noValidate>
        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            name='email'
            value={loginForm.values.email}
            onChange={loginForm.handleChange}
            isInvalid={
              inputError.email || loginForm.errors.email ? true : false
            }
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            {inputError.email ? inputError.email : loginForm.errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            name='password'
            value={loginForm.values.password}
            onChange={loginForm.handleChange}
            isInvalid={
              inputError.password || loginForm.errors.password ? true : false
            }
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            {inputError.password
              ? inputError.password
              : loginForm.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Sign In
        </Button>
      </Form>

      <Row className='my-4'>
        <Col>
          <div className='d-flex'>
            <div className='flex-grow-1 '>
              <Link to='/signup'>New User ? Signup!</Link>
            </div>
            <div className=' ml-auto'>
              <Link to='/forgot-password'> Forgot Password ?</Link>
            </div>
          </div>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default SigninPage
