import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

// CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// Components
import MenuBar from './components/MenuBar'

// About Page
import AboutPage from './pages/AboutPage'

// Auth Pages
import SiginPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

// Product Pages
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'

// Cart Page
import CartPage from './pages/CartPage'

// Checkout Pages
import ShippingPage from './pages/ShippingPage'
import PaymentMethodPage from './pages/PaymentMethodPage'
import PlaceOrderPage from './pages/PlaceOrderPage'

// User Pages
import ProfilePage from './pages/user/ProfilePage'
import EditProfilePage from './pages/user/EditProfilePage'
import ChangePasswordPage from './pages/user/ChangePasswordPage'
import MyOrderListPage from './pages/user/MyOrderListPage'
import MyOrderDetailPage from './pages/user/MyOrderDetailPage'

// Admin Pages
import ProductsListPage from './pages/private/ProductsListPage'
import EditProductPage from './pages/private/EditProductPage'
import CategoryListPage from './pages/private/CategoryListPage'
import EditCategoryPage from './pages/private/EditCategoryPage'
import OrderListPage from './pages/private/OrderListPage'
import OrderDetailPage from './pages/private/OrderDetailPage'

function App() {
  return (
    <Router>
      <MenuBar />
      <Route exact path='/' component={HomePage} />
      <Route exact path='/search/:keyword' component={HomePage} />
      <Container
        style={{ marginTop: '75px' }}
        className='custom-container-margin-top'
      >
        {/* Public Pages */}
        <Route exact path='/product/:productId' component={ProductDetailPage} />
        <Route exact path='/cart' component={CartPage} />
        <Route exact path='/shipping' component={ShippingPage} />
        <Route exact path='/paymentmethod' component={PaymentMethodPage} />
        <Route exact path='/placeorder' component={PlaceOrderPage} />
        <Route exact path='/about' component={AboutPage} />

        {/* Authentication Pages */}
        <Route exact path='/signin' component={SiginPage} />
        <Route exact path='/signup' component={SignupPage} />
        <Route exact path='/forgot-password' component={ForgotPasswordPage} />

        {/* Authorized User Pages */}
        <Route exact path='/user/profile' component={ProfilePage} />
        <Route exact path='/user/profile/edit' component={EditProfilePage} />
        <Route
          exact
          path='/user/password/edit'
          component={ChangePasswordPage}
        />
        <Route exact path='/myorders' component={MyOrderListPage} />
        <Route exact path='/myorder/:id' component={MyOrderDetailPage} />

        {/* Admin Pages */}
        <Route exact path='/admin/products' component={ProductsListPage} />
        <Route
          exact
          path='/admin/product/edit/:productId'
          component={EditProductPage}
        />

        <Route exact path='/admin/category' component={CategoryListPage} />
        <Route
          exact
          path='/admin/category/edit/:id'
          component={EditCategoryPage}
        />

        <Route exact path='/admin/orders' component={OrderListPage} />
        <Route exact path='/admin/order/:id' component={OrderDetailPage} />
      </Container>
    </Router>
  )
}

export default App
