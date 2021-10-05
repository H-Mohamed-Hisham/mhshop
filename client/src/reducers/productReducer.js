import {
  PUBLIC_FETCH_ALL_PRODUCT_FAIL,
  PUBLIC_FETCH_ALL_PRODUCT_REQUEST,
  PUBLIC_FETCH_ALL_PRODUCT_RESET,
  PUBLIC_FETCH_ALL_PRODUCT_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRIVATE_FETCH_ALL_PRODUCT_FAIL,
  PRIVATE_FETCH_ALL_PRODUCT_REQUEST,
  PRIVATE_FETCH_ALL_PRODUCT_RESET,
  PRIVATE_FETCH_ALL_PRODUCT_SUCCESS,
} from '../constants/productConstant'

// ! Public Access

export const productListReducer = (
  state = { loading: true, products: [] },
  action
) => {
  switch (action.type) {
    case PUBLIC_FETCH_ALL_PRODUCT_REQUEST:
      return { ...state, loading: true }
    case PUBLIC_FETCH_ALL_PRODUCT_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        pages: action.payload.pages,
        page: action.payload.page,
        docCount: action.payload.docCount,
        count: action.payload.count,
        pageSize: action.payload.pageSize,
      }
    case PUBLIC_FETCH_ALL_PRODUCT_FAIL:
      return { loading: false, error: action.payload }
    case PUBLIC_FETCH_ALL_PRODUCT_RESET:
      return { products: [] }
    default:
      return state
  }
}

export const topRatedProductReducer = (
  state = { loading: true, products: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_TOP_REQUEST:
      return { loading: true, products: [] }
    case PRODUCT_TOP_SUCCESS:
      return { loading: false, products: action.payload }
    case PRODUCT_TOP_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// ! Admin Access

export const privateProductListReducer = (
  state = { loading: true, products: [] },
  action
) => {
  switch (action.type) {
    case PRIVATE_FETCH_ALL_PRODUCT_REQUEST:
      return { ...state, loading: true }
    case PRIVATE_FETCH_ALL_PRODUCT_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        pages: action.payload.pages,
        page: action.payload.page,
        docCount: action.payload.docCount,
        count: action.payload.count,
        pageSize: action.payload.pageSize,
      }
    case PRIVATE_FETCH_ALL_PRODUCT_FAIL:
      return { loading: false, error: action.payload }
    case PRIVATE_FETCH_ALL_PRODUCT_RESET:
      return { products: [] }
    default:
      return state
  }
}
