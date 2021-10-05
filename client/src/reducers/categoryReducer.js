import {
  PUBLIC_FETCH_ALL_CATEGORY_FAIL,
  PUBLIC_FETCH_ALL_CATEGORY_REQUEST,
  PUBLIC_FETCH_ALL_CATEGORY_RESET,
  PUBLIC_FETCH_ALL_CATEGORY_SUCCESS,
  PRIVATE_FETCH_ALL_CATEGORY_FAIL,
  PRIVATE_FETCH_ALL_CATEGORY_REQUEST,
  PRIVATE_FETCH_ALL_CATEGORY_RESET,
  PRIVATE_FETCH_ALL_CATEGORY_SUCCESS,
} from '../constants/categoryConstant'

// ! Public Access

export const categoryListReducer = (
  state = { loading: true, categories: [] },
  action
) => {
  switch (action.type) {
    case PUBLIC_FETCH_ALL_CATEGORY_REQUEST:
      return { ...state, loading: true }
    case PUBLIC_FETCH_ALL_CATEGORY_SUCCESS:
      return {
        loading: false,
        categories: action.payload,
      }
    case PUBLIC_FETCH_ALL_CATEGORY_FAIL:
      return { loading: false, error: action.payload }
    case PUBLIC_FETCH_ALL_CATEGORY_RESET:
      return { categories: [] }
    default:
      return state
  }
}

// ! Admin Access

export const privateCategoryListReducer = (
  state = { loading: true, categories: [] },
  action
) => {
  switch (action.type) {
    case PRIVATE_FETCH_ALL_CATEGORY_REQUEST:
      return { ...state, loading: true }
    case PRIVATE_FETCH_ALL_CATEGORY_SUCCESS:
      return {
        loading: false,
        categories: action.payload,
      }
    case PRIVATE_FETCH_ALL_CATEGORY_FAIL:
      return { loading: false, error: action.payload }
    case PRIVATE_FETCH_ALL_CATEGORY_RESET:
      return { categories: [] }
    default:
      return state
  }
}
