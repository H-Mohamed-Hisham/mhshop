import {
  MY_ORDER_LIST_REQUEST,
  MY_ORDER_LIST_SUCCESS,
  MY_ORDER_LIST_FAIL,
  MY_ORDER_LIST_RESET,
  ALL_ORDER_LIST_REQUEST,
  ALL_ORDER_LIST_SUCCESS,
  ALL_ORDER_LIST_FAIL,
  ALL_ORDER_LIST_RESET,
} from '../constants/orderConstant'

export const myOrderListReducer = (
  state = { loading: true, orders: [] },
  action
) => {
  switch (action.type) {
    case MY_ORDER_LIST_REQUEST:
      return { ...state, loading: true }
    case MY_ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
        pages: action.payload.pages,
        page: action.payload.page,
        docCount: action.payload.docCount,
        count: action.payload.count,
        pageSize: action.payload.pageSize,
      }
    case MY_ORDER_LIST_FAIL:
      return { loading: false, error: action.payload }
    case MY_ORDER_LIST_RESET:
      return { orders: [] }
    default:
      return state
  }
}

export const privateAllOrderListReducer = (
  state = { loading: true, orders: [] },
  action
) => {
  switch (action.type) {
    case ALL_ORDER_LIST_REQUEST:
      return { ...state, loading: true }
    case ALL_ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
        pages: action.payload.pages,
        page: action.payload.page,
        docCount: action.payload.docCount,
        count: action.payload.count,
        pageSize: action.payload.pageSize,
      }
    case ALL_ORDER_LIST_FAIL:
      return { loading: false, error: action.payload }
    case ALL_ORDER_LIST_RESET:
      return { orders: [] }
    default:
      return state
  }
}
