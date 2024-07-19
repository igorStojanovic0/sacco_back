const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const scorePayoneerSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    payoneerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Payoneer",
    },
    score: {
      type: Number,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    deletedAt: {
      type: Date,
    },
  },
  modelOption("TransactionPayoneer")
);

model("ScorePayoneer", scorePayoneerSchema);
