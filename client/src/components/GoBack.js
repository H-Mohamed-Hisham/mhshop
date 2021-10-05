import React from 'react'
import { Link } from 'react-router-dom'

const GoBack = ({ to }) => {
  return (
    <>
      <Link style={{ fontSize: '20px', letterSpacing: '14px' }} to={to}>
        <i className='fa fa-arrow-left'></i>
      </Link>
    </>
  )
}

export default GoBack
