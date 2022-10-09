const { Article, Comment } = require('../../../models')
const mongoose = require('mongoose')

module.exports = {
  Query: {
    getArticles: async (_root, args, _ctx) => {
      try {
        const page = args?.page || 1
        const perPage = args?.per_page || 10
        const skip = (page - 1) * perPage
        const limit = perPage
        let sort
        let filter
        
        if (args?.sort_by) {
          sort = {
            [`${args?.sort_by.name}`]: args?.sort_by.order
          }
        } else {
          sort =  {
            'updatedAt': -1
          }
        }

        if (args?.filter_by) {
          filter = {
            [`${args?.filter_by.name}`]: args?.filter_by.value
          }
        } else {
          filter = {}
        }

        const findArticles = await Article.aggregate([
          {
            $lookup: {
              from          : 'comments',
              localField    : 'comments',
              foreignField  : '_id',
              as            : 'comments'
            }
          },
          { '$sort'  : sort },
          { '$match' : filter },
          { '$skip'  : skip },
          { '$limit' : limit }
        ])

        const countArticles = await Article.find().count()

        return {
          status  : 200,
          count   : countArticles,
          message : 'getArticles success',
          error   : null,
          data    : findArticles
        }
      } catch (error) {
        return {
          status  : 500,
          count   : null,
          message : 'getArticles error',
          error   : error?.message,
          data    : null
        }
      }
    },

    getArticle: async (_root, args, _ctx) => {
      try {
        const _id = mongoose.Types.ObjectId(args.articleId)
        const findArticleById = await Article.aggregate([
          { $match: { _id } },
          {
            $lookup: {
              from          : 'comments',
              localField    : 'comments',
              foreignField  : '_id',
              as            : 'comments'
            }
          },
       ])

        if (findArticleById?.length < 1) {
          return {
            status  : 404,
            message : 'getArticle error',
            error   : 'Article not found',
            data    : null
          }
        }

        return {
          status  : 200,
          message : 'getArticle success',
          error   : null,
          data    : findArticleById[0]
        }
      } catch (error) {
        return {
          status  : 500,
          message : 'getArticle error',
          error   : error?.message,
          data    : null
        }
      }
    },
  },

  Mutation: {
    createArticle: async (_root, args, _ctx) => {
      try {
        const payload = {
          description: args?.description,
          title: args?.title,
          type: args?.type
        }

        const addArticle = await Article.create(payload)

        return {
          status  : 200,
          message : 'createArticle success',
          error   : null,
          data    : addArticle
        }
      } catch (error) {
        return {
          status  : 500,
          message : 'createArticle error',
          error   : error?.message,
          data    : null
        }
      }
    },

    editArticle: async (_root, args, _ctx) => {
      try {
        const findArticleById = await Article.findById(args.articleId)

        if (!findArticleById) {
          return {
            status  : 404,
            message : 'editArticle error',
            error   : 'Article not found',
            data    : null
          }
        }

        const payload = {
          description: args?.description,
          title: args?.title,
          type: args?.type
        }

        const editArticle = await Article.findOneAndUpdate({ _id: args.articleId }, payload, { new: true })

        return {
          status  : 200,
          message : 'editArticle success',
          error   : null,
          data    : editArticle
        }
      } catch (error) {
        return {
          status  : 500,
          message : 'editArticle error',
          error   : error?.message,
          data    : null
        }
      }
    },

    deleteArticle: async (_root, args, _ctx) => {
      try {
        const findArticleById = await Article.findById(args.articleId)

        if (!findArticleById) {
          return {
            status  : 404,
            message : 'deleteArticle error',
            error   : 'Article not found',
            data    : null
          }
        }

        if (findArticleById.comments?.length > 0) {
          return {
            status  : 422,
            message : 'deleteArticle error',
            error   : `Article can't be deleted because it already has comments`,
            data    : null
          }
        }

        await Article.findOneAndDelete({ _id: args.articleId })

        return {
          status  : 200,
          message : 'deleteArticle success',
          error   : null,
          data    : findArticleById
        }
      } catch (error) {
        return {
          status  : 500,
          message : 'deleteArticle error',
          error   : error?.message,
          data    : null
        }
      }
    }
  }
}