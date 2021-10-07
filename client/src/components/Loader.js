import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = ({ className }) => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '100px',
        height: '100px',
        margin: 'auto',
        display: 'block',
      }}
      className={className}
    >
      <span className='sr-only'>Loading...</span>
    </Spinner>
  )
}

export default Loader
