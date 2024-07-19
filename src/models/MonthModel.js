const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const MonthSchema = new Schema(
  {
    month: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  modelOption("month")
);

model("Month", MonthSchema);
