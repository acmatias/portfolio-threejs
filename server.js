const express = require('express')
const app = express()

const portFinderSync = require('portfinder-sync')
const PORT = portFinderSync.getPort(8080)

// env variable
require('dotenv').config()

// Path for rendering html files
const path = require('path')

// static files to enable css to show
app.use(express.static('src'))

// cors access to enable application on different host to send request
const cors = require('cors')
app.use(cors())

// For post form data
const bodyParser = require('express')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Nodemailer config
const nodemailer = require('nodemailer')

// // Simple approach
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.AUTH_EMAIL,
//         pass: process.env.AUTH_PASS,
//     },
// })

// Gmail OAuth approach
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAUTH2',
        user: process.env.AUTH_EMAIL,
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        refreshToken: process.env.AUTH_REFRESH_TOKEN,
    },
})

// testing nodemailer
transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log('Ready')
        console.log(success)
    }
})

app.post('/sendmail', (req, res) => {
    const { to, subject, text } = req.body

    let mailOptions = {
        from: process.env.AUTH_EMAIL,
        to,
        subject,
        text,
    }

    transporter
        .sendMail(mailOptions)
        .then(() => {
            // Successful message
            res.sendFile(path.join(__dirname, './src/index.html'))
        })
        .catch((error) => {
            // An error occurred
            if (error) return res.status(500).json({ msg: 'Error occurred' })
        })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './src/index.html'))
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
