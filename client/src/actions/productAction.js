import axios from 'axios'

// * Constants
import {
  PUBLIC_FETCH_ALL_PRODUCT_FAIL,
  PUBLIC_FETCH_ALL_PRODUCT_REQUEST,
  PUBLIC_FETCH_ALL_PRODUCT_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRIVATE_FETCH_ALL_PRODUCT_FAIL,
  PRIVATE_FETCH_ALL_PRODUCT_REQUEST,
  PRIVATE_FETCH_ALL_PRODUCT_SUCCESS,
} from '../constants/productConstant'

// ! Public Access

export const fetchAllProducts =
  (pageNumber = '', keyword = '') =>
  async (dispatch) => {
    try {
      dispatch({
        type: PUBLIC_FETCH_ALL_PRODUCT_REQUEST,
      })

      const { data } = await axios.get(
        `/api/public/product?keyword=${keyword}&pageNumber=${pageNumber}`
      )

      dispatch({
        type: PUBLIC_FETCH_ALL_PRODUCT_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: PUBLIC_FETCH_ALL_PRODUCT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const fetchTopRatedProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST })

    const { data } = await axios.get(`/api/product/topratedproduct`)

    dispatch({
      type: PRODUCT_TOP_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// ! Private Access

export const privateFetchAllProducts =
  (pageNumber = '', keyword = '') =>
  async (dispatch) => {
    try {
      dispatch({
        type: PRIVATE_FETCH_ALL_PRODUCT_REQUEST,
      })

      const userToken = localStorage.getItem('mhshop')

      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }

      const { data } = await axios.get(
        `/api/private/product?keyword=${keyword}&pageNumber=${pageNumber}`,
        config
      )

      dispatch({
        type: PRIVATE_FETCH_ALL_PRODUCT_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: PRIVATE_FETCH_ALL_PRODUCT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
