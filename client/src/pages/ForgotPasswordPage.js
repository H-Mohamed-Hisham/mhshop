import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'

// * Components
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [inputError, setInputError] = useState(null)

  // Response state
  const [loading, setLoading] = useState(null)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  // ! Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    setInputError(null)
    if (email !== '') {
      forgotPassword(email)
    } else {
      setInputError('Email address required')
    }
  }

  // ! Forgot Password Function
  async function forgotPassword(email) {
    try {
      setLoading(true)

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      console.log(email)

      const { data } = await axios.post(
        `/api/user/forgotpassword`,
        { email },
        config
      )

      setLoading(false)
      setSuccess(data.message)
    } catch (error) {
      setLoading(false)
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }

  useEffect(() => {}, [success, error])

  return (
    <FormContainer>
      <h1 className='my-4'>Forgot Password</h1>

      {loading && <Loader></Loader>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={inputError !== null ? true : false}
          ></Form.Control>
          {inputError !== null && (
            <Form.Control.Feedback type='invalid'>
              {inputError}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {error && <Message>{error}</Message>}
        {success && <Message variant='success'>{success}</Message>}

        <Button type='submit' variant='primary' disabled={loading}>
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ForgotPasswordPage
