import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";

const SaccoSchema = new Schema({
    name: { type: String, required: true },
    group_id: { type: String, 
        ref: 'Group',
        required: true
    },
    entranceFee: {
        adults: { type: String },
        children: { type: String },
        teens:{ type: String },
        friend: { type: String },
    },
    shares: {
        initialNumber: { type: String },
        nominalPrice: { type: String },
        maxInitial:{ type: String },
    },
    saving: {
        minimumAmount: { type: String },
        lumpSum: { type: String },
    },
    notificationStatus: { type: String },
    loanType: { type: String },
    priorityOfLoan: { type: String },
    traningProgram: { type: String },
    role: {
        admin: { type: String },
        treasurer: { type: String },
        secretary: { type: String },
    },
    approval: {
        maker: { type: String },
        checker: { type: String },
        approver: { type: String },
    },
    created_by: { type: ObjectId, 
        ref: 'User'
    },
    del_flag: { type: Number, default: 0},
},{
    timestamps: true
});

const Sacco = model("Sacco", SaccoSchema);
export default Sacco;
