import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, page, keyword = '', link }) => {
  let paginations = []
  if (page > 1) {
    paginations.push(
      <React.Fragment key={paginations.length}>
        <LinkContainer to={`${link}/1`}>
          <Pagination.First />
        </LinkContainer>
        <LinkContainer to={`${link}/${page - 1}`}>
          <Pagination.Prev />
        </LinkContainer>
      </React.Fragment>
    )
  }

  if (page - 2 > 0) {
    paginations.push(
      <LinkContainer key={paginations.length} to={`${link}/${page - 2}`}>
        <Pagination.Item>{page - 2}</Pagination.Item>
      </LinkContainer>
    )
  }

  if (page - 1 > 0) {
    paginations.push(
      <LinkContainer key={paginations.length} to={`${link}/${page - 1}`}>
        <Pagination.Item>{page - 1}</Pagination.Item>
      </LinkContainer>
    )
  }

  paginations.push(
    <LinkContainer key={paginations.length} to={`${link}/${page}`}>
      <Pagination.Item active={true}>{page}</Pagination.Item>
    </LinkContainer>
  )

  if (page + 1 < pages + 1) {
    paginations.push(
      <LinkContainer key={paginations.length} to={`${link}/${page + 1}`}>
        <Pagination.Item>{page + 1}</Pagination.Item>
      </LinkContainer>
    )
  }

  if (page + 2 < pages + 1) {
    paginations.push(
      <LinkContainer key={paginations.length} to={`${link}/${page + 2}`}>
        <Pagination.Item>{page + 2}</Pagination.Item>
      </LinkContainer>
    )
  }

  if (page + 3 < pages + 1) {
    paginations.push(
      <LinkContainer key={paginations.length} to={`${link}/${page + 3}`}>
        <Pagination.Item>{page + 3}</Pagination.Item>
      </LinkContainer>
    )
  }

  if (page < pages) {
    paginations.push(
      <React.Fragment key={paginations.length}>
        <LinkContainer to={`${link}/${page + 1}`}>
          <Pagination.Next />
        </LinkContainer>
        <LinkContainer to={`${link}/${pages}`}>
          <Pagination.Last />
        </LinkContainer>
      </React.Fragment>
    )
  }

  return pages > 1 && page <= pages && <Pagination>{paginations}</Pagination>
}

export default Paginate
