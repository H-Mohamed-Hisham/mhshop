import React from 'react'
import { Spinner } from 'react-bootstrap'

const TinyLoader = () => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '40px',
        height: '40px',
        margin: '10px',
        display: 'block',
      }}
    >
      <span className='sr-only'>Loading...</span>
    </Spinner>
  )
}

export default TinyLoader
