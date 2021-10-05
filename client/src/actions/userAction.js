import axios from 'axios'

// * Constant
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_RESET,
  USER_LOGOUT,
} from '../constants/userConstant'

import { PRIVATE_FETCH_ALL_CATEGORY_RESET } from '../constants/categoryConstant'
import { PRIVATE_FETCH_ALL_PRODUCT_RESET } from './../constants/productConstant'
import {
  ALL_ORDER_LIST_RESET,
  MY_ORDER_LIST_RESET,
} from '../constants/orderConstant'

import { clearPaymentMethod, clearShippingAddress } from './cartAction'

export const fetchUserDetail = () => async (dispatch) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    })

    const userToken = localStorage.getItem('mhshop')

    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }

    const { data } = await axios.get(`/api/user/profile`, config)

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, Token failed / Token expired') {
      dispatch(logout())
    }
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: message,
    })
  }
}

// ! LOGOUT ACTION

export const logout = () => async (dispatch) => {
  localStorage.removeItem('mhshop')
  dispatch({
    type: USER_LOGOUT,
  })
  dispatch({
    type: USER_DETAILS_RESET,
  })
  dispatch({
    type: PRIVATE_FETCH_ALL_PRODUCT_RESET,
  })
  dispatch({
    type: PRIVATE_FETCH_ALL_CATEGORY_RESET,
  })
  dispatch({
    type: MY_ORDER_LIST_RESET,
  })
  dispatch({
    type: ALL_ORDER_LIST_RESET,
  })
  dispatch(clearShippingAddress())
  dispatch(clearPaymentMethod())
}
