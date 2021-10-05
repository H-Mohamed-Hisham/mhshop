import nodemailer from 'nodemailer'

const mailSender = (mail, subject, message) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hmhwebdev@gmail.com',
      pass: 'pekkaclub',
    },
  })

  // verifying the connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
    } else {
      console.log('Server is ready to take our messages!')
    }
  })

  var mail = {
    from: 'hmhwebdev@gmail.com',
    to: mail,
    subject: subject,
    html: message,
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail',
      })
    } else {
      res.json({
        status: 'success',
      })
    }
  })
}

export default mailSender
