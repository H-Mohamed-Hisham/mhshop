import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { Form, Row, Col, Button } from 'react-bootstrap'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

// * Components
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

const SignupPage = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [inputError, setInputError] = useState({})

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo: loginUserInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (loginUserInfo) {
      history.push(redirect)
    }
    if (message || error) {
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
  }, [message, error, history, redirect, loginUserInfo])

  const registerForm = useFormik({
    initialValues: {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    },
    validationSchema: yup.object({
      name: yup.string().trim().strict().required('Name must not be empty'),
      email: yup
        .string()
        .email('Invalid email')
        .required('Email must not be empty'),
      password: yup
        .string()
        .required('Password must not be empty')
        .min(6, 'Minimum 6 characters required'),
      confirmPassword: yup
        .string()
        .required('Confirm assword must not be empty')
        .oneOf(
          [yup.ref('password'), null],
          'Password & Confirm Password must be same'
        ),
    }),
    onSubmit: (values, { resetForm }) => {
      setInputError({})
      setError(null)
      register(values.name, values.email, values.password)
      resetForm({ values: '' })
    },
  })

  async function register(name, email, password) {
    setLoading(true)

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const response = await axios.post(
      '/api/user/signup',
      { name, email, password },
      config
    )

    const { data } = response

    const { message } = response.data

    if (message) {
      setLoading(false)
      setMessage(message)
    }

    if (data.inputError) {
      setLoading(false)
      setInputError(data.inputError)
    }

    if (data.error) {
      setLoading(false)
      setError(data.error)
    }
  }

  return (
    <FormContainer>
      <h1 className='my-4'>Sign Up</h1>
      {message && (
        <Message variant='info'>
          {message}. Click here to{' '}
          <Link to='/signin' className='message-link'>
            signin
          </Link>
        </Message>
      )}
      {error && <Message>{error}</Message>}
      {loading && <Loader></Loader>}
      <Form onSubmit={registerForm.handleSubmit}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Name'
            name='name'
            value={registerForm.values.name}
            onChange={registerForm.handleChange}
            isInvalid={
              inputError.name || registerForm.errors.name ? true : false
            }
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            {inputError.name ? inputError.name : registerForm.errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            name='email'
            value={registerForm.values.email}
            onChange={registerForm.handleChange}
            isInvalid={
              inputError.email || registerForm.errors.email ? true : false
            }
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            {inputError.email ? inputError.email : registerForm.errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            name='password'
            value={registerForm.values.password}
            onChange={registerForm.handleChange}
            isInvalid={
              inputError.password || registerForm.errors.password ? true : false
            }
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            {inputError.password
              ? inputError.password
              : registerForm.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Confirm Password'
            name='confirmPassword'
            value={registerForm.values.confirmPassword}
            onChange={registerForm.handleChange}
            isInvalid={registerForm.errors.confirmPassword ? true : false}
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            {registerForm.errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Register
        </Button>
      </Form>

      <Row className='my-4'>
        <Col>
          <div className='d-flex'>
            <div className='flex-grow-1 '>
              <Link to='/signin'>Existing User ? Signin!</Link>
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

export default SignupPage
