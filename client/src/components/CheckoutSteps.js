import React from 'react'
import { Row, Col, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

// CSS
import '../css/checkoutstepstyle.css'

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <Row>
      <Col>
        <Nav className='nav nav-pills flex-column flex-sm-row py-3 flex-nowrap checkoutsteps-nav'>
          <Nav.Item className='flex-sm-fill nav-link'>
            {step1 ? (
              <LinkContainer to='/shipping'>
                <Nav.Link className='checkoutsteps-active-border'>
                  1.Shipping
                </Nav.Link>
              </LinkContainer>
            ) : (
              <Nav.Link disabled className='checkoutsteps-disabled-border'>
                1.Shipping
              </Nav.Link>
            )}
          </Nav.Item>

          <Nav.Item className='flex-sm-fill nav-link'>
            {step1 && step2 ? (
              <LinkContainer to='/paymentmethod'>
                <Nav.Link className='checkoutsteps-active-border'>
                  2.Payment
                </Nav.Link>
              </LinkContainer>
            ) : (
              <Nav.Link disabled className='checkoutsteps-disabled-border'>
                2.Payment
              </Nav.Link>
            )}
          </Nav.Item>

          <Nav.Item className='flex-sm-fill nav-link'>
            {step1 && step2 && step3 ? (
              <LinkContainer to='/placeorder'>
                <Nav.Link className='checkoutsteps-active-border'>
                  3.Order
                </Nav.Link>
              </LinkContainer>
            ) : (
              <Nav.Link disabled className='checkoutsteps-disabled-border'>
                3.Order
              </Nav.Link>
            )}
          </Nav.Item>
        </Nav>
      </Col>
    </Row>
  )
}

export default CheckoutSteps
