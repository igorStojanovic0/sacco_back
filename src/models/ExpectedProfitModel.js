const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const ExpectedProfit = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    month: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      require: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  modelOption("expectedProfit")
);

model("ExpectedProfit", ExpectedProfit);
