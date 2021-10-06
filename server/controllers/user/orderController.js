import asyncHandler from 'express-async-handler'

// * Model
import Order from '../../models/orderModel.js'
import Product from '../../models/productModel.js'

import pkg from 'uuidv4'
const { uuid } = pkg
import Stripe from 'stripe'
const stripe = new Stripe(
  'sk_test_51HqwsgBrBOrRrnlyc69LWG9e8fTobnvkPflGi21vYFjEa0Mv1d1IKuOec9bGf8jRLrsFPYOzVqxUQ1LzyaPPbcU100FTu7IRP2'
)

// * @desc - Create New Order & Payment
// * @route - POST /api/order/checkout
// * access - Private
const checkout = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  let createdOrder

  // * If true payment will be processed, Else Some products stock is unavailable (ZERO)
  let stockUnavailable = false

  // * Temp array to store ID & Updated count in stock value
  const updatedStock = []

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  } else {
    await Promise.all(
      orderItems.map(async (orderItem) => {
        const product = await Product.findById(orderItem.productId)
        if (product) {
          if (product.countInStock - orderItem.quantity >= 0) {
            updatedStock.push({
              _id: product._id,
              countInStock: orderItem.quantity,
            })
            stockUnavailable = false
          } else {
            stockUnavailable = true
          }
        }
      })
    )
  }

  if (stockUnavailable === false) {
    await Promise.all(
      updatedStock.map(async (element) => {
        const product = await Product.findById(element._id)
        if (product) {
          product.countInStock = product.countInStock - element.countInStock
          await product.save()
        }
      })
    )

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    createdOrder = await order.save()

    // ! STRIPE CODE
    const orderId = createdOrder._id
    let status
    try {
      const { token } = req.body

      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      })

      const idempotencyKey = uuid()
      const charge = await stripe.charges.create(
        {
          amount: totalPrice * 100,
          currency: 'inr',
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip,
            },
          },
        },
        {
          idempotencyKey,
        }
      )

      const updateToPaid = await Order.findById(orderId)

      if (updateToPaid) {
        updateToPaid.isPaid = true
        updateToPaid.paidAt = Date.now()
        updateToPaid.paymentResult = {
          id: charge.id,
          status: charge.status,
          update_time: charge.created,
          email_address: charge.receipt_email,
        }
      }

      await updateToPaid.save()

      // console.log('Charge:', { charge })

      status = charge.status

      const updatedOrder = await Order.findById(orderId)
      res.json({ status, order: updatedOrder })
    } catch (error) {
      const paymentFailedOrder = await Order.findById(orderId)
      if (paymentFailedOrder) {
        await paymentFailedOrder.remove()
      }

      await Promise.all(
        updatedStock.map(async (element) => {
          const product = await Product.findById(element._id)
          if (product) {
            product.countInStock = product.countInStock + element.countInStock
            await product.save()
          }
        })
      )

      // console.log('Error:', error)

      status = 'failure'
      res.json({ error, status })
    }
  } else {
    res.json({
      outOfStock: true,
      outOfStockMessage:
        'Oops!, Some of the products are currently OUT OF STOCK',
    })
  }
})

// * @desc - Get Logged in User Order List
// * @route - GET /api/order/myorders
// * access - Private
const myOrdersList = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Order.countDocuments()

  const orders = await Order.find({ user: req.user._id })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  const docCount = pageSize * (page - 1)

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    docCount,
    count,
    pageSize,
  })
})

// * @desc - Get logged In User Order By ID
// * @route - GET /api/order/myorder/:id
// * access - Private
const myOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    user: req.user._id,
    _id: req.params.id,
  }).populate('user', 'name email')

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export { checkout, myOrdersList, myOrderById }
