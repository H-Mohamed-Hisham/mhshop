import asyncHandler from 'express-async-handler'
import Order from '../../models/orderModel.js'

// * @desc - Get All Order
// * @route - GET /api/private/order
// * access - Admin
const fetchAllOrders = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Order.countDocuments()

  const orders = await Order.find()
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

// * @desc - Get Order By ID
// * @route - GET /api/private/order/:id
// * access - Admin
const fetchOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// ! Order Status Function
// ! ---------------------

// ! Update Status Function

// * @desc - Update Order to Shipped
// * @route - PUT /api/order/shipped/:id
// * access - Admin
const markOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isShipped = true
    order.shippedAt = Date.now()

    const updatedOrder = await order.save()

    res.json({ success: true, updatedOrder })
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// * @desc - Update Order to Out For Delivery
// * @route - PUT /api/order/outfordelivery/:id
// * access - Admin
const markOrderToOutForDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.outForDelivery = true
    order.outForDeliveryAt = Date.now()

    const updatedOrder = await order.save()

    res.json({ success: true, updatedOrder })
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// * @desc - Update Order to Delievered
// * @route - PUT /api/order/delivered/:id
// * access - Admin
const markOrderTodelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json({ success: true, updatedOrder })
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// ! Revert Status Function

// * @desc - UNMARK Update Order to Shipped
// * @route - PUT /api/order/shipped/:id
// * access - Admin
const unmarkOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isShipped = false
    order.shippedAt = null

    order.outForDelivery = false
    order.outForDeliveryAt = null

    order.isDelivered = false
    order.deliveredAt = null

    const updatedOrder = await order.save()

    res.json({ success: true, updatedOrder })
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// * @desc - UNMARK Update Order to Out For Delivery
// * @route - PUT /api/order/outfordelivery/:id
// * access - Admin
const unmarkOrderToOutForDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.outForDelivery = false
    order.outForDeliveryAt = null

    order.isDelivered = false
    order.deliveredAt = null

    const updatedOrder = await order.save()

    res.json({ success: true, updatedOrder })
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// * @desc - UNMARK Update Order to Delievered
// * @route - PUT /api/order/delivered/:id
// * access - Admin
const unmarkOrderTodelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = false
    order.deliveredAt = null

    const updatedOrder = await order.save()

    res.json({ success: true, updatedOrder })
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// ! Close Order

// * @desc - Update Order to Delievered
// * @route - PUT /api/order/delivered/:id
// * access - Admin
const closeOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.orderClosed = true

    const updatedOrder = await order.save()

    res.json({ success: true, updatedOrder })
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export {
  fetchAllOrders,
  fetchOrderById,
  markOrderToShipped,
  unmarkOrderToShipped,
  markOrderToOutForDelivery,
  unmarkOrderToOutForDelivery,
  markOrderTodelivered,
  unmarkOrderTodelivered,
  closeOrder,
}
