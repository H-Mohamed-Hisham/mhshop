import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import { savePaymentMethod } from '../actions/cartAction'

import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = ({ history }) => {
  const checkout = useSelector((state) => state.checkout)
  const { shippingAddress } = checkout

  const cartProduct = useSelector((state) => state.cartProduct)
  const { checkoutCart } = cartProduct

  if (shippingAddress === null) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('Stripe')

  const dispatch = useDispatch()

  useEffect(() => {
    if (checkoutCart.length === 0) {
      history.push('/cart')
    }
  }, [history, checkoutCart])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <h3 className='mb-2'>Payment Method</h3>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>

          <Col>
            {/* <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked={paymentMethod === 'PayPal'}
              onChange={e => setPaymentMethod(e.target.value)}
            ></Form.Check> */}

            <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='button' variant='primary' onClick={submitHandler}>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
