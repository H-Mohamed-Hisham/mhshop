import React from 'react'
import { Row, Col } from 'react-bootstrap'

const Count = ({ count, docCount, length, title }) => {
  return (
    <Row className='py-3'>
      <Col>
        Displaying {title} {docCount + 1}-{docCount + length} of {count}
      </Col>
    </Row>
  )
}

export default Count
