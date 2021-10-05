import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

// * DB Connection
import connectDB from './config/db.js'

// * Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

// * User Route
import userRoute from './routes/user/userRoute.js'

// * Order Route
import orderRoute from './routes/user/orderRoute.js'

// * Public Route
import publicCategoryRoute from './routes/public/categoryRoute.js'
import publicProductRoute from './routes/public/productRoute.js'
import publicCartRoute from './routes/public/cartRoute.js'

// * Private Route
import privateCategoryRoute from './routes/private/categoryRoute.js'
import privateProductRoute from './routes/private/productRoute.js'
import privateImageUploadRoute from './routes/private/imageUploadRoute.js'
import privateOrderRoute from './routes/private/orderRoute.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

// ! User Route
app.use('/api/user', userRoute)

// ! Order Route
app.use('/api/order', orderRoute)

// ! Public Route
app.use('/api/public/category', publicCategoryRoute)
app.use('/api/public/product', publicProductRoute)
app.use('/api/public/cart', publicCartRoute)

// ! Private Route
app.use('/api/private/category', privateCategoryRoute)
app.use('/api/private/product', privateProductRoute)
app.use('/api/private/image-upload', privateImageUploadRoute)
app.use('/api/private/order', privateOrderRoute)

// app.get('/', (req, res) => {
//   res.send('API is running...')
// })

const __dirname = path.resolve()
// console.log(__dirname); // C:\React\mhshop
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static('uploads'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('API is running...')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  )
)
