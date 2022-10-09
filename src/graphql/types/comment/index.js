module.exports = `
  scalar Date

  type article {
    _id         : String
    description : String
    title       : String
    type        : String
    createdAt   : Date
    updatedAt   : Date
  }

  type comment {
    _id         : String
    comment     : String
    articleId   : String
    article     : [article]
    createdAt   : Date
    updatedAt   : Date
  }

  type responseComments {
    status  : Int
    count   : Int
    message : String
    error   : String
    data    : [comment]
  }

  type responseComment {
    status  : Int
    message : String
    error   : String
    data    : comment
  }

  type Query {
    getComments(
      page      : Int!
      per_page  : Int! 
    ) : responseComments

    getComment (
      commentId : String!
    ) : responseComment
  }

  type Mutation {
    createComment (
      articleId : String!
      comment   : String
    ) : responseComment

    editComment (
      articleId : String!
      commentId : String!
      comment   : String
    ) : responseComment

    deleteComment (
      articleId : String!
      commentId : String!
    ) : responseComment
  }
`