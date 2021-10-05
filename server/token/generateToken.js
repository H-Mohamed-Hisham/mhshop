import jwt from 'jsonwebtoken'

const generateToken = (id, name, role) => {
  return jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  })
}

export default generateToken
