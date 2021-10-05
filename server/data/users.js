import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Mohamed',
    email: 'mohamedhishamhaja@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true
  },
  {
    name: 'Mohamed',
    email: 'mohamed@example.com',
    password: bcrypt.hashSync('123456', 10)
  },
  {
    name: 'Hisham',
    email: 'hisham@example.com',
    password: bcrypt.hashSync('123456', 10)
  }
]

export default users
