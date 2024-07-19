const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const MonthSetSchema = new Schema(
  {
    value: {
      type: Number,
      default: 25,
      require: true,
    },
    goal: {
      type: String,
      default: "endDate",
    },
  },
  modelOption("endDate")
);

model("MonthEndDate", MonthSetSchema);

const monthEndDateInit = async () => {
  try {
    const MonthEndDate = model("MonthEndDate");
    const monthEndDate = await MonthEndDate.findOne({});
    if (monthEndDate) return;
    else
      MonthEndDate.create({ value: 20 }, (err, result) => {
        if (err) throw err;
        console.log("EndDate : ", "Create EndDate ->" + result.value);
      });
  } catch (err) {
    console.log("EndDate : ", err.message);
  }
};

monthEndDateInit();
