import { Document, model, Schema } from "mongoose";

interface UserDoc extends Document {
    title: string;
    surName: string;
    givenName: string;
    otherNames?: string;
    photograph?: string; // assuming it's a file upload
    gender: string;
    tribe?: string;
    religion?: string;
    placeOfBirth?: string;
    currentParish?: string;
    dateOfBirth: string;
    nationalIDNumber: string;
    nationalIDPhoto?: string;
    email: string;
    phone: string;
    password: string;
    birthday: Date;
    homeAddress: string;
    homeLocation?: string;
    districtOfBirth?: string;
    birthParish?: string;
    birthVillage?: string;
    birthHome?: string;
    maritalStatus?: string;
    profession?: string;
    jobTitle?: string;
    nextOfKin?: {
        nationalID?: string;
        contactName?: string;
        contactPhone?: string;
        contactEmail?: string;
    };
    monthlyIncome?: string;
    bankName?: string;
    accountNumber?: string;
    registeredMobileAccount?: string;
    registeredEmailWithBank?: string;
    highestEducation?: string;
    otherEducation?: string;
    employmentStatus?: string;
    placeOfWorkAddress?: string;
    employerDetails?: {
        name?: string;
        salary?: string;
        sideHustleIncome?: string;
    };
    groupMembership?: {
        joiningDate?: string;
        recommender?: {
            fullName?: string;
            nationalID?: string;
            email?: string;
            phone?: string;
        };
    };
    notificationPreferences?: string;
    twoFactorAuth?: boolean;
    securityQuestions?: {
        question?: string;
        answer?: string;
    };
    consentAgreements?: boolean;
    customFields?: any; 
    is_active: boolean;
    is_profileCompleted: boolean;
    userID?: string;
    last_login: Date;
    date_joined: Date;
    del_falg: number;
    verified: boolean;
    salt: string;
    role: "User" | "Manager" | "Admin";
    otp: number;
    otpExpiryTime: Date;
    _doc: UserDoc;
};

const UserSchema = new Schema({
    title: { type: String, default: ''},
    surName: { type: String, required: true },
    givenName: { type: String, required: true },
    otherNames: { type: String },
    photograph: { type: String, default: 'default' },
    gender: { 
        type: String, 
        Enum: {
            values: ["Male", "Female", "Other"],
            message: "{VALUE} is not a valid gender"
        } 
    },
    tribe: { type: String },
    religion: { type: String },
    placeOfBirth: { type: String },
    currentParish: { type: String },
    birthday: { type: Date },
    nationalIDNumber: { type: String },
    nationalIDPhoto: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    homeAddress: { type: String },
    homeLocation: { type: String },
    districtOfBirth: { type: String },
    birthParish: { type: String },
    birthVillage: { type: String },
    birthHome: { type: String },
    maritalStatus: { type: String },
    profession: { type: String },
    jobTitle: { type: String },
    nextOfKin: {
        nationalID: { type: String },
        contactName: { type: String },
        contactPhone:{ type: String },
        contactEmail: { type: String },
    },
    monthlyIncome: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    registeredMobileAccount: { type: String },
    registeredEmailWithBank: { type: String },
    highestEducation: { type: String },
    otherEducation: { type: String },
    employmentStatus: { type: String },
    placeOfWorkAddress: { type: String },
    employerDetails: {
        name: {type: String},
        salary: { type: String},
        sideHustleIncome: { type: String}
    },
    groupMembership: {
        joiningDate: {type: Date},
        recommender: {
            fullName: {type: String},
            nationalID: {type: String},
            email: {type: String},
            phone: {type: String},
        }
    },
    userID: {type: String},
    notificationPreferences: {type: String},
    twoFactorAuth: { 
        type: String, 
        Enum: {
            values: ["Enabled", "Disabled"],
            message: "{VALUE} is not a valid gender"
        } 
    },
    securityQuestions: {
        question: {type: String},
        answer: {type: String},
    },
    consentAgreements: {type: Boolean},
    customFields: {type: String},
    is_active: { type: Boolean, default: false},
    is_profileCompleted: { type : Boolean, default: false},
    last_login: { type: Date},
    date_joined: { type: Date },
    del_falg: { type: Number, default: 0 },
    salt: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    otp: { type: Number, required: true,},
    otpExpiryTime: { type: Date, required: true,},
    role: { 
        type: String,
        required: true,
        enum: {
            values: ['User', 'Manager' ,'Admin'],
            message: "Value not allowed as role"
        },
        default: 'User'
    },
},{
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

const User = model<UserDoc>("User", UserSchema);
export default User;
