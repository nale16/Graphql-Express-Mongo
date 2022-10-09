const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum : ['editorial', 'essay', 'hypothesis']
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
   }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('article', articleSchema)