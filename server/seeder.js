import mongoose from 'mongoose'
import dotenv from 'dotenv'
import users from './data/users.js'
import properties from './data/properties.js'
import User from './models/userModel.js'
import Property from './models/PropertyModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Property.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const admin = createdUsers[0]._id

    const sampleProperties = properties.map(property => {
      return { ...property, user: admin }
    })

    await Property.insertMany(sampleProperties)

    console.log('Data Imported!')
    process.exit
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Property.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!')
    process.exit
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
