const { mergeTypes } = require('merge-graphql-schemas')

const article = require('./article')
const comment = require('./comment')

const typeDefs = [
  article,
  comment
]

module.exports = mergeTypes(typeDefs, { all: true })