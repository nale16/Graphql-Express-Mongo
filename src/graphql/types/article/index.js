module.exports = `
  scalar Date

  type comment {
    _id         : String
    comment     : String
    createdAt   : Date
    updatedAt   : Date
  }

  type article {
    _id         : String
    description : String
    title       : String
    type        : String
    createdAt   : Date
    updatedAt   : Date
    comments    : [comment]
  }

  type responseArticles {
    status  : Int
    count   : Int
    message : String
    error   : String
    data    : [article]
  }

  type responseArticle {
    status  : Int
    message : String
    error   : String
    data    : article
  }

  input sort_by {
    name  : String!
    order : Int!
  }

  input filter_by {
    name  : String!
    value : String!
  }

  type Query {
    getArticles(
      page      : Int!
      per_page  : Int!
      sort_by   : sort_by
      filter_by : filter_by
    ) : responseArticles

    getArticle (
      articleId : String!
    ) : responseArticle
  }

  type Mutation {
    createArticle (
      description : String
      title       : String!
      type        : String
    ) : responseArticle

    editArticle (
      articleId   : String!
      description : String
      title       : String
      type        : String
    ) : responseArticle

    deleteArticle (
      articleId : String!
    ) : responseArticle
  }
`