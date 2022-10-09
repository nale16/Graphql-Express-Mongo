const express = require('express')
const dotenv = require('dotenv')

const { connectDB } = require('./db')

const app = express()

dotenv.config()

connectDB()

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome 💡! Go to /graphql' })
})

app.listen(process.env.PORT, () => {
  console.log(`App running on PORT ${process.env.PORT} 🚀`)
})