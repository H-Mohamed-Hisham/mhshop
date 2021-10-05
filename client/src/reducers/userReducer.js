import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
} from '../constants/userConstant'

export const userLoginReducer = (
  state = { loading: true, userLoginInfo: null },
  action
) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true }
    case USER_LOGIN_SUCCESS:
      return { loading: false, userLoginInfo: action.payload }
    case USER_LOGIN_FAIL:
      return { loading: false, userLoginInfo: null }
    case USER_LOGOUT:
      return { userLoginInfo: null }
    default:
      return state
  }
}

export const userDetailReducer = (
  state = { loading: false, user: null, error: null },
  action
) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case USER_DETAILS_SUCCESS:
      return {
        loading: false,
        user: action.payload,
        error: null,
      }
    case USER_DETAILS_FAIL:
      return { loading: false, user: null, error: action.payload }
    case USER_DETAILS_RESET:
      return { user: null, error: null }
    default:
      return state
  }
}
