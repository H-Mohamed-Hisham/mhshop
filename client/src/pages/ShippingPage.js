import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'

// * Components
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import Loader from '../components/Loader'

// * Actions
import { saveShippingAddress } from '../actions/cartAction'

const ShippingPage = ({ history }) => {
  const dispatch = useDispatch()

  const userDetail = useSelector((state) => state.userDetail)
  const { loading, error } = userDetail

  const cartProduct = useSelector((state) => state.cartProduct)
  const { checkoutCart } = cartProduct

  const checkout = useSelector((state) => state.checkout)
  const { shippingAddress } = checkout

  // ! Shipping Address Data State
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    if (checkoutCart.length === 0) {
      history.push('/cart')
    }
    if (shippingAddress !== null) {
      setAddress(shippingAddress.address)
      setCity(shippingAddress.city)
      setPostalCode(shippingAddress.postalCode)
      setCountry(shippingAddress.country)
    }
  }, [history, checkoutCart, shippingAddress])

  const shippingAddressForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: address,
      city: city,
      postalCode: postalCode,
      country: country,
    },
    validationSchema: yup.object({
      address: yup.string().trim().strict().required('Address required'),
      city: yup.string().trim().strict().required('City required'),
      postalCode: yup.string().trim().strict().required('Zip Code required'),
      country: yup.string().trim().strict().required('Country required'),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(
        saveShippingAddress({
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          country: values.country,
        })
      )
      history.push('/paymentmethod')
    },
  })

  return (
    <FormContainer>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <CheckoutSteps step1></CheckoutSteps>
          <h3 className='pb-3'>Shipping Address</h3>
          <Form onSubmit={shippingAddressForm.handleSubmit}>
            <Form.Group controlId='address'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Name'
                name='address'
                value={shippingAddressForm.values.address}
                onChange={shippingAddressForm.handleChange}
                isInvalid={shippingAddressForm.errors.address ? true : false}
              ></Form.Control>
              <Form.Control.Feedback type='invalid'>
                {shippingAddressForm.errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='city'>
              <Form.Label>City</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter City'
                name='city'
                value={shippingAddressForm.values.city}
                onChange={shippingAddressForm.handleChange}
                isInvalid={shippingAddressForm.errors.city ? true : false}
              ></Form.Control>
              <Form.Control.Feedback type='invalid'>
                {shippingAddressForm.errors.city}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='zipCode'>
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Postal Code'
                name='postalCode'
                value={shippingAddressForm.values.postalCode}
                onChange={shippingAddressForm.handleChange}
                isInvalid={shippingAddressForm.errors.postalCode ? true : false}
              ></Form.Control>
              <Form.Control.Feedback type='invalid'>
                {shippingAddressForm.errors.postalCode}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='country'>
              <Form.Label>Country</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Country'
                name='country'
                value={shippingAddressForm.values.country}
                onChange={shippingAddressForm.handleChange}
                isInvalid={shippingAddressForm.errors.country ? true : false}
              ></Form.Control>
              <Form.Control.Feedback type='invalid'>
                {shippingAddressForm.errors.country}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Button type='submit' variant='primary'>
                Continue
              </Button>
            </Form.Group>
          </Form>
        </>
      )}
    </FormContainer>
  )
}

export default ShippingPage
