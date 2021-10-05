import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_CLEAR,
  SHIPPING_ADDRESS,
  PAYMENT_METHOD,
  CART_PRODUCT_REQUEST,
  CART_PRODUCT_SUCCESS,
  CART_PRODUCT_FAIL,
  CART_PRODUCT_RESET,
  CART_PRODUCT_QTY,
  CART_PRODUCT_REMOVE,
  CART_PRODUCT_INITIAL_QUANTITY,
  CHECKOUT_CART,
} from '../constants/cartConstant'

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload

      const existItem = state.cartItems.find((x) => x === item)

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) => (x === existItem ? item : x)),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x !== action.payload),
      }

    case CART_CLEAR:
      localStorage.removeItem('cartItems')
      return {
        cartItems: [],
      }

    default:
      return state
  }
}

export const cartProductReducer = (
  state = { loading: true, cartProductItems: [], checkoutCart: [] },
  action
) => {
  switch (action.type) {
    case CART_PRODUCT_REQUEST:
      return { ...state, loading: true }

    case CART_PRODUCT_SUCCESS:
      return {
        loading: false,
        cartProductItems: action.payload,
      }

    case CART_PRODUCT_FAIL:
      return { loading: false, error: action.payload }

    case CART_PRODUCT_RESET:
      return { cartProductItems: [] }

    case CART_PRODUCT_INITIAL_QUANTITY:
      let initialQuantity = state.cartProductItems.map((cartItem, index) => {
        if (action.payload[index].countInStock === 0) {
          return { ...cartItem, quantity: 0 }
        } else {
          return { ...cartItem, quantity: 1 }
        }
      })
      return { ...state, loading: false, cartProductItems: initialQuantity }

    case CART_PRODUCT_QTY:
      let tempCart = state.cartProductItems.map((cartItem) => {
        if (cartItem._id === action.payload.id) {
          return { ...cartItem, quantity: action.payload.qty }
        }
        return cartItem
      })
      return { ...state, cartProductItems: tempCart }

    case CART_PRODUCT_REMOVE:
      return {
        ...state,
        cartProductItems: state.cartProductItems.filter(
          (x) => x._id !== action.payload.id
        ),
      }

    case CHECKOUT_CART:
      let filteredCheckouCart = state.cartProductItems.filter(
        (x) => x.countInStock >= 1
      )
      let checkoutCart = filteredCheckouCart.map((cartItem, index) => {
        return {
          name: cartItem.name,
          quantity: cartItem.quantity,
          image: cartItem.image,
          price: cartItem.price,
          productId: cartItem._id,
        }
      })
      return { ...state, checkoutCart: checkoutCart }

    default:
      return state
  }
}

export const checkoutReducer = (
  state = { shippingAddress: null, paymentMethod: null },
  action
) => {
  switch (action.type) {
    case SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      }

    case PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      }

    default:
      return state
  }
}
