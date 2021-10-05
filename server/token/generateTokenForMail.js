import jwt from 'jsonwebtoken'

const generateTokenForMail = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })
}

export default generateTokenForMail
