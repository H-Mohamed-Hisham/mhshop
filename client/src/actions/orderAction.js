import axios from 'axios'
import {
  MY_ORDER_LIST_REQUEST,
  MY_ORDER_LIST_SUCCESS,
  MY_ORDER_LIST_FAIL,
  ALL_ORDER_LIST_REQUEST,
  ALL_ORDER_LIST_SUCCESS,
  ALL_ORDER_LIST_FAIL,
} from '../constants/orderConstant'

// ! Private Access

export const fetchMyOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: MY_ORDER_LIST_REQUEST,
    })

    const userToken = localStorage.getItem('mhshop')

    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }

    const { data } = await axios.get(`/api/order/myorders`, config)

    dispatch({
      type: MY_ORDER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: MY_ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// ! Admin Access

export const fetchAllOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: ALL_ORDER_LIST_REQUEST,
    })

    const userToken = localStorage.getItem('mhshop')

    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }

    const { data } = await axios.get(`/api/private/order/`, config)

    dispatch({
      type: ALL_ORDER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ALL_ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
