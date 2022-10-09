const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { graphqlHTTP } = require('express-graphql')
const bodyParser = require('body-parser')

const { connectDB } = require('./db')
const schema = require('./graphql')

const app = express()

dotenv.config()

connectDB()

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome 💡! Go to /graphql' })
})

app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(process.env.PORT, () => {
  console.log(`App running on PORT ${process.env.PORT} 🚀`)
})