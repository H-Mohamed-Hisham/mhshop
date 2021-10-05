import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { Form, Row, Col, Button } from 'react-bootstrap'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import axios from 'axios'

// * Components
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import GoBack from '../../components/GoBack'

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [message, setMessage] = useState(null)
  const [errorUpdate, setErrorUpdate] = useState(null)

  useEffect(() => {
    if (message || errorUpdate) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }, [message, errorUpdate])

  const changePasswordForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    },
    validationSchema: yup.object({
      currentPassword: yup
        .string()
        .trim()
        .strict()
        .required('Current password required'),
      newPassword: yup
        .string()
        .required('Password required')
        .min(6, 'Minimum 6 characters required'),
      confirmPassword: yup
        .string()
        .required('Confirm Password required')
        .oneOf(
          [yup.ref('newPassword'), null],
          'Password & Confirm Password must be same'
        ),
    }),
    onSubmit: (values, { resetForm }) => {
      setErrorUpdate(null)
      changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })

      resetForm({ values: '' })
    },
  })

  async function changePassword(userPassword) {
    setLoadingUpdate(true)
    try {
      const userToken = localStorage.getItem('mhshop')

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }
      const response = await axios.put(
        `/api/user/updatepassword`,
        userPassword,
        config
      )

      const { message } = response.data

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
        <h3 className='pb-3'>Change Password</h3>
      </div>

      {loadingUpdate && <Loader />}
      {!loadingUpdate && errorUpdate !== null && (
        <Message>{errorUpdate}</Message>
      )}
      {!loadingUpdate && (
        <>
          {message && <Message variant='info'>{message}</Message>}
          <Form onSubmit={changePasswordForm.handleSubmit}>
            <Form.Group controlId='currentPassword'>
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter Current Password'
                name='currentPassword'
                value={changePasswordForm.values.currentPassword}
                onChange={changePasswordForm.handleChange}
                isInvalid={
                  changePasswordForm.errors.currentPassword ? true : false
                }
              ></Form.Control>
              <Form.Control.Feedback type='invalid'>
                {changePasswordForm.errors.currentPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='newPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter Password'
                name='newPassword'
                value={changePasswordForm.values.newPassword}
                onChange={changePasswordForm.handleChange}
                isInvalid={changePasswordForm.errors.newPassword ? true : false}
              ></Form.Control>
              <Form.Control.Feedback type='invalid'>
                {changePasswordForm.errors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter Confirm Password'
                name='confirmPassword'
                value={changePasswordForm.values.confirmPassword}
                onChange={changePasswordForm.handleChange}
                isInvalid={
                  changePasswordForm.errors.confirmPassword ? true : false
                }
              ></Form.Control>
              <Form.Control.Feedback type='invalid'>
                {changePasswordForm.errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col xs={6} sm={4} md={4} lg={4}>
                <Button type='submit' variant='primary' className='btn-block'>
                  Update
                </Button>
              </Col>
              <Col xs={6} sm={4} md={4} lg={4}>
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

export default ChangePasswordPage
