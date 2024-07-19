const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const dailyReportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "User",
    },
    done: {
      type: String,
      maxlength: 500,
    },
    issue: {
      type: String,
      maxlength: 500
    },
    archieve: {
      type: Number,
      default: 0,
    },
    skill: {
      type: String,
      maxlength: 500
    },
    newJob: {
      type: String,
      maxlength: 500
    },
    plan: {
      type: String,
      maxlength: 500
    },
    request: {
      type: String,
      maxlength: 500
    },
    estimate: {
      type: String,
      maxlength: 500
    },
    other: {
      type: String,
      maxlength: 500
    },
    note: {
      type: String,
      maxlength: 500
    },
    date: {
      type: Date,
    }
  },
  modelOption("dailyreports")
);

model("DailyReport", dailyReportSchema);
