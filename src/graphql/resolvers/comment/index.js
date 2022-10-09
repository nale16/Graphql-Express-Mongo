const { Comment, Article } = require('../../../models')
const mongoose = require('mongoose')

module.exports = {
  Query: {
    getComments: async (_root, args, _ctx) => {
      try {
        const page = args?.page || 1
        const perPage = args?.per_page || 10
        const skip = (page - 1) * perPage
        const limit = perPage

        const findComments = await Comment.aggregate([
          {
            $lookup: {
              from          : 'articles',
              localField    : 'articleId',
              foreignField  : '_id',
              as            : 'article'
            }
          },
          { '$skip' : skip },
          { '$limit': limit }
        ])

        const countComments = await Comment.find().count()

        return {
          status  : 200,
          count   : countComments,
          message : 'getComments success',
          error   : null,
          data    : findComments
        }
      } catch (error) {
        return {
          status  : 500,
          count   : null,
          message : 'getComments error',
          error   : error?.message,
          data    : null
        }
      }
    },

    getComment: async (_root, args, _ctx) => {
      try {
        const _id = mongoose.Types.ObjectId(args.commentId)
        const findCommentById = await Comment.aggregate([
          { $match: { _id: _id } },
          {
            $lookup: {
              from          : 'articles',
              localField    : 'articleId',
              foreignField  : '_id',
              as            : 'article'
            }
          },
       ])

        if (!findCommentById?.length) {
          return {
            status  : 404,
            message : 'getComment error',
            error   : 'Comment not found',
            data    : null
          }
        }

        return {
          status  : 200,
          message : 'getComment success',
          error   : null,
          data    : findCommentById[0]
        }
      } catch (error) {
        return {
          status  : 500,
          message : 'getComment error',
          error   : error?.message,
          data    : null
        }
      }
    },
  },

  Mutation: {
    createComment: async (_root, args, _ctx) => {
      try {
        const payload = {
          articleId: args?.articleId,
          comment: args?.comment
        }

        const findArticleById = await Article.findById(args?.articleId)
        if (!findArticleById) {
          return {
            status  : 404,
            message : 'createComment error',
            error   : 'Article not found',
            data    : null
          }
        }

        const addComment = await Comment.create(payload)

        const appendCommentInArticle = findArticleById?.comments?.concat(addComment?._id)
        await Article.findOneAndUpdate({ _id: findArticleById }, { comments: appendCommentInArticle })

        return {
          status  : 200,
          message : 'createComment success',
          error   : null,
          data    : addComment
        }
      } catch (error) {
        return {
          status  : 500,
          message : 'createComment error',
          error   : error?.message,
          data    : null
        }
      }
    },

    editComment: async (_root, args, _ctx) => {
      try {
        const findArticleById = await Article.findById(args?.articleId)
        if (!findArticleById) {
          return {
            status  : 404,
            message : 'editComment error',
            error   : 'Article not found',
            data    : null
          }
        }

        const findCommentById = await Comment.findById(args.commentId)
        if (!findCommentById) {
          return {
            status  : 404,
            message : 'editComment error',
            error   : 'Comment not found',
            data    : null
          }
        }

        const findCommentInArticle = findArticleById?.comments?.find((item) => {
          return item.toString() === args.commentId.toString()
        })
        if (!findCommentInArticle) {
          return {
            status  : 422,
            message : 'deleteComment error',
            error   : 'Comment not found in Article',
            data    : null
          }
        }

        const payload = {
          comment: args?.comment
        }

        const editComment = await Comment.findOneAndUpdate({ _id: args.commentId }, payload, { new: true })

        return {
          status  : 200,
          message : 'editComment success',
          error   : null,
          data    : editComment
        }
      } catch (error) {
        return {
          status  : 500,
          message : 'editComment error',
          error   : error?.message,
          data    : null
        }
      }
    },

    deleteComment: async (_root, args, _ctx) => {
      try {
        const findArticleById = await Article.findById(args?.articleId)
        if (!findArticleById) {
          return {
            status  : 404,
            message : 'deleteComment error',
            error   : 'Article not found',
            data    : null
          }
        }

        const findCommentById = await Comment.findById(args.commentId)
        if (!findCommentById) {
          return {
            status  : 404,
            message : 'deleteComment error',
            error   : 'Comment not found',
            data    : null
          }
        }

        if (findCommentById?.articleId.toString() !== args.articleId.toString()) {
          return {
            status  : 422,
            message : 'deleteComment error',
            error   : 'Comment not found in Article',
            data    : null
          }
        }

        await Article.findOneAndUpdate({ _id: findArticleById }, { comments: deleteCommentInArticle })

        await Comment.deleteOne({ _id: args.commentId })

        return {
          status  : 200,
          message : 'deleteComment success',
          error   : null,
          data    : findCommentById
        }
      } catch (error) {
        return {
          status  : 500,
          message : 'deleteComment error',
          error   : error?.message,
          data    : null
        }
      }
    }
  }
}