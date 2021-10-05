import axios from 'axios'
import {
  PUBLIC_FETCH_ALL_CATEGORY_FAIL,
  PUBLIC_FETCH_ALL_CATEGORY_REQUEST,
  PUBLIC_FETCH_ALL_CATEGORY_SUCCESS,
  PRIVATE_FETCH_ALL_CATEGORY_FAIL,
  PRIVATE_FETCH_ALL_CATEGORY_REQUEST,
  PRIVATE_FETCH_ALL_CATEGORY_SUCCESS,
} from '../constants/categoryConstant'

// ! Public Access

export const fetchAllCategory = () => async (dispatch) => {
  try {
    dispatch({
      type: PUBLIC_FETCH_ALL_CATEGORY_REQUEST,
    })

    const { data } = await axios.get(`/api/public/category`)

    dispatch({
      type: PUBLIC_FETCH_ALL_CATEGORY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PUBLIC_FETCH_ALL_CATEGORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// ! Admin Access

export const privateFetchAllCategory = () => async (dispatch) => {
  try {
    dispatch({
      type: PRIVATE_FETCH_ALL_CATEGORY_REQUEST,
    })

    const userToken = localStorage.getItem('mhshop')

    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }

    const { data } = await axios.get(`/api/private/category`, config)

    dispatch({
      type: PRIVATE_FETCH_ALL_CATEGORY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRIVATE_FETCH_ALL_CATEGORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
