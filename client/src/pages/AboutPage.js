import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

// * CSS
import '../css/aboutstyle.css'

const AboutPage = () => {
  return (
    <Row className='py-3'>
      <Col xs={12} md={12} className='py-3 d-flex justify-content-center '>
        <p className='text-uppercase text-center'>About this application</p>
      </Col>

      <Col
        xs={12}
        md={12}
        className='py-3 d-flex flex-column justify-content-center align-items-center'
      >
        <Card bg='primary' className='text-center author-card'>
          <Card.Body>
            <p>Designed & Developed by</p>
            <p>
              <a
                href='https://www.linkedin.com/in/mohamed-hisham-aa30838a/'
                className=' dd'
              >
                Mohamed Hisham
              </a>
            </p>
            <p className='mb-0'>
              <a
                href='https://www.linkedin.com/in/mohamed-hisham-aa30838a/'
                className='linkedin-logo'
              >
                <i className='fab fa-linkedin'></i>
              </a>
            </p>
          </Card.Body>
        </Card>
      </Col>

      <Col
        xs={12}
        md={12}
        className='py-3 d-flex flex-column justify-content-center align-items-center'
      >
        <Card border='info' className='info-card px-3'>
          <Card.Body>
            <ul>
              <li>This web application is not a real world ecommerce site.</li>
              <li>
                The payment methods are in <i className='fab fa-cc-stripe'></i>{' '}
                test mode. Application won't capture real amount from users.
              </li>
              <li>
                For testing purpose please use the below card details for
                successful transaction.
              </li>
            </ul>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={12} className='py-3 d-flex justify-content-center'>
        <div className='creditcard-wrapper'>
          <div className='creditcard-logo'>
            <i className='fab fa-cc-visa'></i>
          </div>
          <div className='creditcard-number'>
            <p>4242 4242 4242 4242</p>
          </div>
          <div className='creditcard-name'>
            <p>Name</p>
          </div>
          <div className='creditcard-exp-cvv'>
            <span>EXP : Future MM/YY</span>
            <span>CVV : 123</span>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default AboutPage
