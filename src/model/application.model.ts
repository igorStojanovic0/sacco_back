import { model, Schema } from "mongoose";
import { ApplicationDoc } from "../dto/application.dto";

const ApplicationSchema = new Schema({
    surName: { type: String, required: true },
    givenName: { type: String, required: true },
    nationalId: { type: String, required: true },
    email: { type: String, required: true },
    teacherId: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { 
        type: String, 
        required: true,
        Enum: {
            values: ["Male", "Female", "Other"],
            message: "{VALUE} is not a valid gender"
        } 
    },
    maritalStatus: { 
        type: String, 
        required: true,
        Enum: {
            values: ["Single", "Married", "Divorced", "Widowed"],
            message: "{VALUE} is not a valid marital status"
        }
    },
    numberOfDependencies: { type: Number, required: true },
    workSchool: { type: String, required: true },
    position: { type: String, required: true },
    monthlySalary: { type: Number, required: true },
    amountRequested: { type: Number, required: true },
    repaymentPeriod: { type: Number, required: true },
    bankAccountNumber: { type: String, required: true },
    proofOfEmployment: { type: String, required: true },
    copyOfNationalId: { type: String, required: true },
    loanStatus: { 
        type: String, 
        required: true,
        Enum: {
            values: ["Pending", "Update required", "Approved", "Rejected"],
            message: "{VALUE} is not a valid loan status"
        },
        default: "Pending"
    },
},{
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret.__v;
        }
    },
    timestamps: true
});

export const Application = model<ApplicationDoc>("Application", ApplicationSchema);