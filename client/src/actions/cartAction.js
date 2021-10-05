import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  SHIPPING_ADDRESS,
  PAYMENT_METHOD,
  CART_PRODUCT_REQUEST,
  CART_PRODUCT_SUCCESS,
  CART_PRODUCT_FAIL,
  CART_PRODUCT_INITIAL_QUANTITY,
} from '../constants/cartConstant'

export const addToCart = (id) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/public/product/${id}`)

  dispatch({
    type: CART_ADD_ITEM,
    payload: data._id,
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

// Shipping Address
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const clearShippingAddress = () => (dispatch) => {
  dispatch({
    type: SHIPPING_ADDRESS,
    payload: null,
  })

  localStorage.removeItem('shippingAddress')
}

// Payment Method
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const clearPaymentMethod = () => (dispatch) => {
  dispatch({
    type: PAYMENT_METHOD,
    payload: null,
  })

  localStorage.removeItem('paymentMethod')
}

// Cart Product

export const productCart = () => async (dispatch) => {
  try {
    dispatch({
      type: CART_PRODUCT_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const productId = []
    const cartItems = JSON.parse(localStorage.getItem('cartItems'))

    for (var key in cartItems) {
      productId.push(cartItems[key])
    }

    const { data } = await axios.post(`/api/public/cart`, productId, config)

    dispatch({
      type: CART_PRODUCT_SUCCESS,
      payload: data,
    })

    dispatch({
      type: CART_PRODUCT_INITIAL_QUANTITY,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CART_PRODUCT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
