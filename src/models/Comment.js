const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Article' 
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('comment', commentSchema)