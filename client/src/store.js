import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import jwtDecode from 'jwt-decode'

// * Reducers
import { userLoginReducer, userDetailReducer } from './reducers/userReducer'

import {
  productListReducer,
  topRatedProductReducer,
  privateProductListReducer,
} from './reducers/productReducer'

import {
  cartReducer,
  cartProductReducer,
  checkoutReducer,
} from './reducers/cartReducer'

import {
  myOrderListReducer,
  privateAllOrderListReducer,
} from './reducers/orderReducer'

// * Actions
import { fetchUserDetail } from './actions/userAction'
import {
  categoryListReducer,
  privateCategoryListReducer,
} from './reducers/categoryReducer'

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userDetail: userDetailReducer,
  productList: productListReducer,
  topRatedProduct: topRatedProductReducer,
  cart: cartReducer,
  cartProduct: cartProductReducer,
  checkout: checkoutReducer,
  privateProductList: privateProductListReducer,
  categoryList: categoryListReducer,
  privateCategoryList: privateCategoryListReducer,
  myOrderList: myOrderListReducer,
  privateAllOrderList: privateAllOrderListReducer,
})

// * User Info From Local Storage
let userInfoFromStorage

if (localStorage.getItem('mhshop')) {
  try {
    const decodedToken = jwtDecode(localStorage.getItem('mhshop'))
    const userToken = localStorage.getItem('mhshop')

    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('mhshop')
    } else {
      userInfoFromStorage = userToken
    }
  } catch (error) {
    // Invalid Token
    userInfoFromStorage = null
    localStorage.removeItem('mhshop')
  }
} else {
  userInfoFromStorage = null
}

// * Cart Info Local Storage
let cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

// * Shipping Address From Local Storage
let shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : null

const initialState = {
  userLogin: { userLoginInfo: userInfoFromStorage },
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

if (userInfoFromStorage !== null) {
  store.dispatch(fetchUserDetail())
}

export default store
