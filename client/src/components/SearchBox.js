import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {
  const getKeywordValue = window.location.pathname.split('/')
  const keywordValue = getKeywordValue[2] || ''

  const [keyword, setKeyword] = useState(keywordValue)

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${encodeURIComponent(keyword)}`)
    } else {
      history.push('/')
    }
  }

  return (
    <Form
      onSubmit={submitHandler}
      inline
      className='align-items-stretch flex-nowrap'
    >
      <Form.Control
        type='text'
        name='q'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
        Search
      </Button>
    </Form>
  )
}

export default withRouter(SearchBox)
