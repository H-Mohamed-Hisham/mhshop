import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const router = express.Router()

import pkg from 'cloudinary'
const { v2: cloudinary } = pkg

import pkgc from 'multer-storage-cloudinary'
const { CloudinaryStorage } = pkgc

import multer from 'multer'

// * Middleware
import { admin, protect } from '../../middleware/authMiddleware.js'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

// cloudinary.config({
//   cloud_name: 'hm-hisham',
//   api_key: '266468563739693',
//   api_secret: '2W6L6iaUcrv2vySBDot_YEYsHJw',
// })

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'MH-SHOP',
  },
})

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg and .jpeg formats allowed!'))
    }
  },
  limits: { fileSize: 524288 },
}).single('image')

router.post('/', (req, res) => {
  protect,
    admin,
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // ! A Multer error occurred when uploading.
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.json({ uploadError: 'Image file size must be below 500KB' })
        }
      } else if (err) {
        res.json({ uploadError: err.message })
      } else {
        const result = await cloudinary.uploader.upload(req.file.path)
        res.json({ uploadSuccess: result.url })
      }
    })
})

export default router
