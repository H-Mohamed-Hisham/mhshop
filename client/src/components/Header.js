import React from 'react'
import { withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap'

import { logout } from '../actions/userAction'

// CSS
// import '../css/headerstyle.css'

// Components
import TinyLoader from './TinyLoader'
// import SearchBox from './SearchBox'

const MenuBar = ({ history }) => {
  const dispatch = useDispatch()

  const userDetail = useSelector((state) => state.userDetail)
  const { loading, error, user } = userDetail

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const logoutHandler = () => {
    dispatch(logout())
    history.push('/signin')
  }

  return (
    <header>
      <Navbar
        bg='primary'
        variant='dark'
        expand='lg'
        fixed='top'
        collapseOnSelect
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>MH Shop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse>
            <Nav className='ml-auto'>
              {/* Loading Icon */}
              {loading && (
                <li className='navbar-li'>
                  <TinyLoader className='navbar-tiny-loader' />
                </li>
              )}

              {/* Public Access Menu */}
              {!loading && user === null && (
                <>
                  <LinkContainer to='/signin' className='mr-4'>
                    <Nav.Link>Signin</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/signup' className='mr-4'>
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                </>
              )}

              {/* Admin Menu */}
              {!loading && user !== null && user.role === 1 && error === null && (
                <NavDropdown title='Admin'>
                  <LinkContainer to='/admin/category'>
                    <NavDropdown.Item>Category</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/products'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orders'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              {/* User Access Menu */}
              {!loading && user !== null && error === null && (
                <NavDropdown title='User'>
                  <LinkContainer to='/user/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/myorders'>
                    <NavDropdown.Item>My Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              <LinkContainer to='/cart' className='mr-4'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i> Cart{' '}
                  <span className='badge bg-light text-black-50'>
                    {cartItems.length}
                  </span>
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to='/about'>
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default withRouter(MenuBar)
