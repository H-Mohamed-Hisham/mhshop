import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

// * Model
import User from '../../models/userModel.js'

// * Token
import generateToken from '../../token/generateToken.js'
import generateTokenForMail from '../../token/generateTokenForMail.js'

// * User Validator
import {
  validateSignupInput,
  validateSigninInput,
} from '../../validator/userValidator.js'

// * Helper Class
import mailSender from './../../helperclass/mailSender.js'

// ! Public Access

// * @desc - Register new user
// * @route - POST /api/user/signup
// * @access - Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validate user signup data
  const { valid, inputError } = validateSignupInput(name, email, password)
  if (!valid) {
    return res.json({
      inputError,
    })
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    return res.json({ error: 'Email already exists' })
  }

  const user = await User.create({
    name,
    email,
    password,
    isAccountVerified: true,
  })

  if (user) {
    res.status(201).json({
      message: `Your account has been created`,
    })
  } else {
    return res.json({ error: 'Invalid user data' })
  }
})

// * @desc - Sign In (Auth user & get token)
// * @route - POST /api/user/signin
// * @access - Public
const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validate user signup data
  const { valid, inputError } = validateSigninInput(email, password)

  if (!valid) {
    return res.json({
      inputError,
    })
  }

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    if (user && user.isAccountVerified) {
      res.json({
        token: generateToken(user._id, user.name, user.role),
      })
    } else {
      return res.json({
        error: 'Email has been not verified',
      })
    }
  } else {
    return res.json({
      error: 'Invalid email or password',
    })
  }
})

// * @desc - Forgot Password
// * @route - POST /api/user/forgotpassword
// * @access - Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (user) {
    const subject = 'Reset Password Link'
    const token = generateTokenForMail(user._id)
    const message = `<div>
        <p>Hola!, <strong>${user.name}</strong></p>
        <p>Please click the link below to reset your account password</p>
        <p>
          <a href='${process.env.CLIENT_URI}/reset-password/${token}'>Reset Password</a>
        </p>
        <p>Note: Verification link is valid for 15 minutes only.</p>
      </div>`

    mailSender(email, subject, message)
    res.status(200)
    res.json({
      message: `Password reset link has been sent to ${email}`,
    })
  } else {
    res.status(400)
    throw new Error('Account not found')
  }
})

// * @desc - Reset Password
// * @route - POST /api/user/resetpassword
// * @access - Public
const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, token } = req.body

  if (token) {
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET)
      const { id } = decode

      const user = await User.findById(id)

      if (user) {
        user.password = newPassword

        await user.save()

        res.json({
          message: 'Password changed successfully',
        })
      } else {
        res.status(400)
        throw new Error('Account not found')
      }
    } catch (error) {
      res.status(400)
      throw new Error('Invalid / Expired Token')
    }
  }
})

// ! Private Access

// * @desc - Get user profile
// * @route - GET /api/user/profile
// * access - Private
const getUserProfile = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id).select(
  //   '-password -role -isAccountVerified'
  // )

  const user = await User.findById(req.user._id).select(
    '-password -isAccountVerified'
  )

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// * @desc - Update user profile
// * @route - PUT /api/user/profile
// * @access - Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  if (user) {
    const { name } = req.body

    user.name = name || user.name

    await user.save()

    const updatedUser = await User.findById(req.user._id).select(
      '-password -role -isAccountVerified'
    )

    res.json({
      user: updatedUser,
      message: 'Profile Updated',
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// * @desc - Update user password
// * @route - PUT /api/user/updatepassword
// * @access - Private
const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  const { currentPassword, newPassword } = req.body

  if (user) {
    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword

      await user.save()

      res.json({
        message: 'Password Updated Successfully',
      })
    } else {
      throw new Error('Invalid current password')
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
}
