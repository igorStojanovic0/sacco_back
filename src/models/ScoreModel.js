const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const transactionSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    note: {
      type: String,
    },
    income: {
      type: Number,
    },
    inPayType: {
      type: String,
    },
    expense: {
      type: Number,
    },
    exPayType: {
      type: String,
    },
    deletedAt: {
      type: Date,
    },
  },
  modelOption("scores")
);

model("Transaction", transactionSchema);
