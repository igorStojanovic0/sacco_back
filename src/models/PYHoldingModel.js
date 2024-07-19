const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const PYHoldingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    PYId: {
      type: Schema.Types.ObjectId,
      ref: "Payoneer",
    },
    PYAmount: {
      type: Number,
    },
  },
  modelOption("py_holdings")
);

model("PYHoldings", PYHoldingsSchema);
