import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DropdownButton, Dropdown } from 'react-bootstrap'

import { logout } from '../actions/userAction'

// CSS
import '../css/menubarstyle.css'

// Components
import TinyLoader from './TinyLoader'

const MenuBar = ({ history }) => {
  const dispatch = useDispatch()

  const userDetail = useSelector((state) => state.userDetail)
  const { loading, error, user } = userDetail

  // Toggle Nav
  function handleClick() {
    const burger = document.querySelector('.burger')
    const nav = document.querySelector('.nav-links')
    const navLinks = document.querySelectorAll('.nav-links li')

    nav.classList.toggle('nav-active')

    // Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ''
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${
          index / 7 + 0.3
        }s`
      }
    })

    // Burger Animation
    burger.classList.toggle('toggle')
  }

  // Toggle Nav
  function closeMenuOnMenuClick() {
    const burger = document.querySelector('.burger')
    const nav = document.querySelector('.nav-links')
    const navLinks = document.querySelectorAll('.nav-links li')

    nav.classList.toggle('nav-active')

    // Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ''
      }
    })

    // Burger Animation
    burger.classList.toggle('toggle')
  }

  const logoutHandler = () => {
    dispatch(logout())
    history.push('/signin')
  }

  return (
    <nav>
      <div className='logo'>
        <Link to='/'>MH SHOP</Link>
      </div>

      <ul className='nav-links'>
        {loading && <TinyLoader />}

        {/* Public Access Menu */}
        {!loading && user === null && (
          <>
            <li>
              <Link to='/signin' onClick={closeMenuOnMenuClick}>
                Signin
              </Link>
            </li>
            <li>
              <Link to='/signup' onClick={closeMenuOnMenuClick}>
                Signup
              </Link>
            </li>
            <li>
              <Link to='/cart' onClick={closeMenuOnMenuClick}>
                Cart
              </Link>
            </li>
          </>
        )}

        {/* Admin Menu */}
        {!loading && user !== null && user.role === 1 && error === null && (
          <>
            <li>
              <DropdownButton
                title='Admin'
                className='menu-dropdown-button custom-menu-link-letter-spacing'
              >
                <Dropdown.Item
                  as={Link}
                  to='/admin/category'
                  onClick={closeMenuOnMenuClick}
                >
                  Category
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to='/admin/products'
                  onClick={closeMenuOnMenuClick}
                >
                  Products
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to='/admin/orders'
                  onClick={closeMenuOnMenuClick}
                >
                  Orders
                </Dropdown.Item>
              </DropdownButton>
            </li>
          </>
        )}

        {/* Authorized User Menu */}
        {!loading && user !== null && error === null && (
          <>
            <li>
              <DropdownButton
                title={user ? user.name : 'User'}
                className='menu-dropdown-button custom-menu-link-letter-spacing'
              >
                <Dropdown.Item
                  as={Link}
                  to='/user/profile'
                  onClick={closeMenuOnMenuClick}
                >
                  My Profile
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to='/myorders'
                  onClick={closeMenuOnMenuClick}
                >
                  My Orders
                </Dropdown.Item>

                <Dropdown.Item>
                  <span
                    onClick={() => {
                      logoutHandler()
                      closeMenuOnMenuClick()
                    }}
                  >
                    Logout
                  </span>
                </Dropdown.Item>
              </DropdownButton>
            </li>
            <li>
              <Link to='/cart' onClick={closeMenuOnMenuClick}>
                Cart
              </Link>
            </li>
          </>
        )}

        <li>
          <Link to='/about' onClick={closeMenuOnMenuClick}>
            About
          </Link>
        </li>
      </ul>

      <div className='burger' onClick={handleClick}>
        <div className='line1'></div>
        <div className='line2'></div>
        <div className='line3'></div>
      </div>
    </nav>
  )
}

export default withRouter(MenuBar)
