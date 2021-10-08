import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../actions/userAction'

// CSS
import '../css/menubarstyle.css'

// Components
import TinyLoader from './TinyLoader'
// import SearchBox from './SearchBox'

const MenuBar = ({ history }) => {
  const dispatch = useDispatch()

  const userDetail = useSelector((state) => state.userDetail)
  const { loading, error, user } = userDetail

  function alleventListener() {
    const navToggler = document.querySelector('.nav-toggler')
    const navMenu = document.querySelector('.site-navbar .navbar-ul')

    // togglerClick function
    function togglerClick() {
      navToggler.classList.toggle('toggler-open')
      navMenu.classList.toggle('open')
    }

    togglerClick()
  }

  // navLinkClick function
  function navLinkClick() {
    const navToggler = document.querySelector('.nav-toggler')
    const navMenu = document.querySelector('.site-navbar .navbar-ul')
    if (navMenu.classList.contains('open')) {
      navToggler.click()
    }
  }

  // Admin Menu Toggler
  function adminMenuToggler() {
    const isUserMenuOpen = document.querySelector('.user-menu')
    if (isUserMenuOpen.classList.contains('user-menu-visible')) {
      userMenuToggler()
    }
    const adminMenu = document.querySelector('.admin-menu')
    adminMenu.classList.toggle('admin-menu-visible')
  }

  // User Menu Toggler
  function userMenuToggler() {
    const isAdminMenuOpen = document.querySelector('.admin-menu')
    if (isAdminMenuOpen.classList.contains('admin-menu-visible')) {
      adminMenuToggler()
    }
    const userMenu = document.querySelector('.user-menu')
    userMenu.classList.toggle('user-menu-visible')
  }

  const logoutHandler = () => {
    dispatch(logout())
    history.push('/signin')
  }

  return (
    <>
      <div className='navbar-area'>
        <div className='navbar-container'>
          <nav className='site-navbar'>
            <Link to='/' className='site-logo' onClick={navLinkClick}>
              MH
            </Link>

            <ul className='navbar-ul'>
              {loading && (
                <li className='navbar-li'>
                  <TinyLoader className='navbar-tiny-loader' />
                </li>
              )}

              {/* Public Access Menu */}
              {!loading && user === null && (
                <>
                  <li className='navbar-li'>
                    <Link
                      to='/signin'
                      className='navbar-link'
                      onClick={navLinkClick}
                    >
                      Signin
                    </Link>
                  </li>
                  <li className='navbar-li'>
                    <Link
                      to='/signup'
                      className='navbar-link'
                      onClick={navLinkClick}
                    >
                      Signup
                    </Link>
                  </li>
                </>
              )}

              {/* Admin Menu */}
              {!loading && user !== null && user.role === 1 && error === null && (
                <li className='navbar-li'>
                  <span
                    className='navbar-link admin-click'
                    onClick={adminMenuToggler}
                  >
                    admin
                  </span>
                  <ul className='admin-menu'>
                    <li className='admin-menu-link'>
                      <Link to='/admin/category' onClick={navLinkClick}>
                        Category
                      </Link>
                    </li>
                    <li className='admin-menu-link'>
                      <Link to='/admin/products' onClick={navLinkClick}>
                        Products
                      </Link>
                    </li>
                    <li className='admin-menu-link'>
                      <Link to='/admin/orders' onClick={navLinkClick}>
                        Orders
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {/* Authorized User Menu */}
              {!loading && user !== null && error === null && (
                <>
                  <li className='navbar-li'>
                    <span
                      className='navbar-link user-click'
                      onClick={userMenuToggler}
                    >
                      User
                    </span>
                    <ul className='user-menu'>
                      <li className='user-menu-link'>
                        <Link to='/user/profile' onClick={navLinkClick}>
                          My Profile
                        </Link>
                      </li>
                      <li className='user-menu-link'>
                        <Link to='/myorders' onClick={navLinkClick}>
                          My Orders
                        </Link>
                      </li>
                      <li className='user-menu-link'>
                        <span
                          className='logout-span'
                          onClick={() => {
                            logoutHandler()
                            navLinkClick()
                          }}
                        >
                          Logout
                        </span>
                      </li>
                    </ul>
                  </li>
                </>
              )}

              <li className='navbar-li'>
                <Link to='/cart' className='navbar-link' onClick={navLinkClick}>
                  Cart
                </Link>
              </li>

              <li className='navbar-li'>
                <Link
                  to='/about'
                  className='navbar-link'
                  onClick={navLinkClick}
                >
                  About
                </Link>
              </li>
            </ul>

            <button className='nav-toggler' onClick={alleventListener}>
              <span></span>
            </button>
          </nav>
        </div>
      </div>
    </>
  )
}

export default withRouter(MenuBar)
