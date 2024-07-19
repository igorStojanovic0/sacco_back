const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const articleSchema = new Schema(
  {
    userName: {
      type: String,
      // require: true,
      // default: "JKS"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Article'
    },
    files: [{
      type: Schema.Types.ObjectId,
      ref: 'File'
    }],
    ancestor: {
      type: Schema.Types.ObjectId,
      ref: 'Article'
      // ref: process.env.MODEL_PREFIX + "_users",
    },
    title: {
      type: String,
      // required: [true, "Must be provided product name"],
      // trim: true,
    },
    summary: [{
      type: String
    }],
    content: {
      type: String,
    },

    topic: {
      type: String,
      // required: [true, "Must be provided product category"],
    },
    category: {
      type: Schema.Types.ObjectId,
      // required: [true, "Must be provided product category"],
      ref: 'ArticleCategory'
    },
    type: {
      type: String,
      // required: [true, "Must be provided product category"],
    },
    browse: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    ],
    like: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    ],
    unlike: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    ],
    isPermitted: {
      type: Number,
      default: 0,
    },
    del: {
      type: Boolean,
      default: false
    }
  },
  modelOption("article")
);

model("Article", articleSchema);


const articlecategorySchema = new Schema(
  {
    title: { type: String, required: true },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'ArticleCategory',
    },
    idPath: { type: String },
    parentNum: { type: String },
    num: { type: String },
    numPath: { type: String },
    del: { type: Boolean, default: false },
  },
  modelOption("article_category")
);

model("ArticleCategory", articlecategorySchema);
