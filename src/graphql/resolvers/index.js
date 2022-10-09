const { mergeResolvers } = require('merge-graphql-schemas')

const article = require('./article')
const comment = require('./comment')

const resolvers = [
  article,
  comment
]

module.exports = mergeResolvers(resolvers)